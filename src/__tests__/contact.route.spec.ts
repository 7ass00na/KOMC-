import { beforeEach, describe, expect, it, vi } from "vitest";

const sendMailMock = vi.fn();
const verifyMock = vi.fn();
const createTransportMock = vi.fn(() => ({
  verify: verifyMock,
  sendMail: sendMailMock,
}));

vi.mock("nodemailer", () => ({
  default: {
    createTransport: createTransportMock,
  },
}));

describe("contact route", () => {
  beforeEach(() => {
    vi.resetModules();
    sendMailMock.mockReset();
    verifyMock.mockReset();
    createTransportMock.mockClear();
    verifyMock.mockResolvedValue(true);
    sendMailMock.mockResolvedValue({ messageId: "contact-1" });
    process.env.SMTP_HOST = "smtp.hostinger.com";
    process.env.SMTP_PORT = "465";
    process.env.SMTP_USER = "info@khaledomer.ae";
    process.env.SMTP_PASS = "hostinger-secret";
    process.env.SMTP_FROM = "info@khaledomer.ae";
    delete process.env.CONTACT_SMTP_HOST;
    delete process.env.CONTACT_SMTP_PORT;
    delete process.env.CONTACT_SMTP_USER;
    delete process.env.CONTACT_SMTP_PASS;
    delete process.env.CONTACT_SMTP_FROM;
    delete process.env.CONTACT_TO_EMAIL;
    delete process.env.CONTACT_BCC_EMAIL;
  });

  it("sends a consultation email to the requested primary recipient with blind copy delivery", async () => {
    const { POST } = await import("@/app/api/contact/route");

    const req = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": "203.0.113.9",
      },
      body: JSON.stringify({
        fullName: "Ahmed Hassan",
        gender: "male",
        email: "client@example.com",
        phone: "+971 54 345 6591",
        address: "Dubai, UAE",
        inquiry: "Maritime Law",
        caseTitle: "Cargo dispute",
        caseDesc: "Need a consultation.",
        preferredDateTime: "2026-05-01T10:30",
        preferredContact: "email",
        lang: "en",
      }),
    });

    const response = await POST(req);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(createTransportMock).toHaveBeenCalledOnce();
    expect(verifyMock).toHaveBeenCalledOnce();
    expect(sendMailMock).toHaveBeenCalledOnce();

    const transportConfig = createTransportMock.mock.calls[0][0];
    expect(transportConfig.host).toBe("smtp.hostinger.com");
    expect(transportConfig.port).toBe(465);
    expect(transportConfig.secure).toBe(true);
    expect(transportConfig.auth).toEqual({
      user: "info@khaledomer.ae",
      pass: "hostinger-secret",
    });

    const mail = sendMailMock.mock.calls[0][0];
    expect(mail.to).toBe("info@khaledomer.ae");
    expect(mail.bcc).toBe("ahmedhussan068@gmail.com");
    expect(mail.from).toBe("info@khaledomer.ae");
    expect(mail.replyTo).toBe("client@example.com");
    expect(mail.subject).toBe("Customer seeking legal representation from the KOMC - website");
    expect(mail.text).toContain("Hello, Khaled Omar Maritime & Legal Consulting Team.");
    expect(mail.text).toContain("I am seeking legal advice and representation for the subject with the details below.");
    expect(mail.text).toContain("Lead Source: KOMC website - Contact Us page");
    expect(mail.html).toContain("Hello, Khaled Omar Maritime & Legal Consulting Team.");
  });

  it("rejects invalid phone numbers", async () => {
    const { POST } = await import("@/app/api/contact/route");

    const req = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        fullName: "Ahmed Hassan",
        email: "client@example.com",
        phone: "abc",
        inquiry: "Maritime Law",
        preferredContact: "email",
        lang: "en",
      }),
    });

    const response = await POST(req);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe("INVALID_PHONE");
    expect(payload.field).toBe("phone");
    expect(sendMailMock).not.toHaveBeenCalled();
  });

  it("returns field-specific validation errors for invalid names", async () => {
    const { POST } = await import("@/app/api/contact/route");

    const req = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        fullName: "12345",
        email: "client@example.com",
        phone: "+971 54 345 6591",
        inquiry: "Maritime Law",
        preferredContact: "email",
        lang: "en",
      }),
    });

    const response = await POST(req);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe("INVALID_FULL_NAME");
    expect(payload.field).toBe("fullName");
    expect(sendMailMock).not.toHaveBeenCalled();
  });

  it("returns a duplicate success response when the same submission arrives twice in a short window", async () => {
    const { POST } = await import("@/app/api/contact/route");

    const body = {
      fullName: "Ahmed Hassan",
      gender: "male",
      email: "client@example.com",
      phone: "+971 54 345 6591",
      address: "Dubai, UAE",
      inquiry: "Maritime Law",
      caseTitle: "Cargo dispute",
      caseDesc: "Need a consultation.",
      preferredDateTime: "2026-05-01T10:30",
      preferredContact: "email",
      lang: "en",
    };

    const first = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": "203.0.113.9",
      },
      body: JSON.stringify(body),
    });

    const second = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": "203.0.113.9",
      },
      body: JSON.stringify(body),
    });

    const firstResponse = await POST(first);
    const secondResponse = await POST(second);

    expect(firstResponse.status).toBe(200);
    expect(secondResponse.status).toBe(200);
    expect(await secondResponse.json()).toMatchObject({ ok: true, duplicate: true });
    expect(sendMailMock).toHaveBeenCalledOnce();
  });
});

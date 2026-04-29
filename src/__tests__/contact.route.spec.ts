import { beforeEach, describe, expect, it, vi } from "vitest";

const primarySendMailMock = vi.fn();
const bccSendMailMock = vi.fn();
const primaryVerifyMock = vi.fn();
const bccVerifyMock = vi.fn();
const createTransportMock = vi.fn()
  .mockImplementationOnce(() => ({
    verify: primaryVerifyMock,
    sendMail: primarySendMailMock,
  }))
  .mockImplementationOnce(() => ({
    verify: bccVerifyMock,
    sendMail: bccSendMailMock,
  }));

vi.mock("nodemailer", () => ({
  default: {
    createTransport: createTransportMock,
  },
}));

describe("contact route", () => {
  beforeEach(() => {
    vi.resetModules();
    primarySendMailMock.mockReset();
    bccSendMailMock.mockReset();
    primaryVerifyMock.mockReset();
    bccVerifyMock.mockReset();
    createTransportMock.mockReset();
    createTransportMock
      .mockImplementationOnce(() => ({
        verify: primaryVerifyMock,
        sendMail: primarySendMailMock,
      }))
      .mockImplementationOnce(() => ({
        verify: bccVerifyMock,
        sendMail: bccSendMailMock,
      }));
    primaryVerifyMock.mockResolvedValue(true);
    bccVerifyMock.mockResolvedValue(true);
    primarySendMailMock.mockResolvedValue({ messageId: "contact-primary-1" });
    bccSendMailMock.mockResolvedValue({ messageId: "contact-bcc-1" });
    process.env.CONTACT_PRIMARY_SMTP_HOST = "smtp.hostinger.com";
    process.env.CONTACT_PRIMARY_SMTP_PORT = "465";
    process.env.CONTACT_PRIMARY_SMTP_USER = "info@khaledomer.com";
    process.env.CONTACT_PRIMARY_SMTP_PASS = "hostinger-secret";
    process.env.CONTACT_PRIMARY_SMTP_FROM = "info@khaledomer.com";
    process.env.CONTACT_BCC_SMTP_HOST = "smtp.gmail.com";
    process.env.CONTACT_BCC_SMTP_PORT = "465";
    process.env.CONTACT_BCC_SMTP_USER = "ahmedhussano68@gmail.com";
    process.env.CONTACT_BCC_SMTP_PASS = "gmail-app-password";
    process.env.CONTACT_BCC_SMTP_FROM = "ahmedhussano68@gmail.com";
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_PORT;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;
    delete process.env.SMTP_FROM;
    delete process.env.CONTACT_TO_EMAIL;
    delete process.env.CONTACT_BCC_EMAIL;
  });

  it("sends consultation emails to the requested primary recipient and mirrored bcc mailbox", async () => {
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
    expect(createTransportMock).toHaveBeenCalledTimes(2);
    expect(primaryVerifyMock).toHaveBeenCalledOnce();
    expect(bccVerifyMock).toHaveBeenCalledOnce();
    expect(primarySendMailMock).toHaveBeenCalledOnce();
    expect(bccSendMailMock).toHaveBeenCalledOnce();

    const primaryTransportConfig = createTransportMock.mock.calls[0][0];
    expect(primaryTransportConfig.host).toBe("smtp.hostinger.com");
    expect(primaryTransportConfig.port).toBe(465);
    expect(primaryTransportConfig.secure).toBe(true);
    expect(primaryTransportConfig.auth).toEqual({
      user: "info@khaledomer.com",
      pass: "hostinger-secret",
    });

    const bccTransportConfig = createTransportMock.mock.calls[1][0];
    expect(bccTransportConfig.host).toBe("smtp.gmail.com");
    expect(bccTransportConfig.port).toBe(465);
    expect(bccTransportConfig.secure).toBe(true);
    expect(bccTransportConfig.auth).toEqual({
      user: "ahmedhussano68@gmail.com",
      pass: "gmail-app-password",
    });

    const primaryMail = primarySendMailMock.mock.calls[0][0];
    expect(primaryMail.to).toBe("info@khaledomer.com");
    expect(primaryMail.from).toBe("info@khaledomer.com");
    expect(primaryMail.replyTo).toBe("client@example.com");
    expect(primaryMail.subject).toMatch(/^New consultation request from the KOMC website - /);
    expect(primaryMail.text).toContain("Gender: male");
    expect(primaryMail.text).toContain("Address: Dubai, UAE");
    expect(primaryMail.text).toContain("Type of Inquiry: Maritime Law");
    expect(primaryMail.text).toContain("Lead Source: KOMC website - Contact page");
    expect(primaryMail.html).toContain("Please review the client details below");

    const bccMail = bccSendMailMock.mock.calls[0][0];
    expect(bccMail.to).toBe("ahmedhussano68@gmail.com");
    expect(bccMail.from).toBe("ahmedhussano68@gmail.com");
    expect(bccMail.replyTo).toBe("client@example.com");
    expect(bccMail.subject).toBe(primaryMail.subject);
    expect(bccMail.text).toContain("Lead Source: KOMC website - Contact page");
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
        lang: "en",
      }),
    });

    const response = await POST(req);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe("INVALID_PHONE");
    expect(primarySendMailMock).not.toHaveBeenCalled();
    expect(bccSendMailMock).not.toHaveBeenCalled();
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
    expect(primarySendMailMock).toHaveBeenCalledOnce();
    expect(bccSendMailMock).toHaveBeenCalledOnce();
  });
});

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
    process.env.SMTP_HOST = "smtp.example.com";
    process.env.SMTP_PORT = "587";
    process.env.SMTP_USER = "mailer@example.com";
    process.env.SMTP_PASS = "secret";
    process.env.SMTP_FROM = "no-reply@example.com";
    delete process.env.CONTACT_TO_EMAIL;
    delete process.env.CONTACT_BCC_EMAIL;
  });

  it("sends consultation emails to the requested primary recipient and bcc", async () => {
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
    expect(sendMailMock).toHaveBeenCalled();

    const mail = sendMailMock.mock.calls[0][0];
    expect(mail.to).toBe("info@khaledomer.ae");
    expect(mail.bcc).toBe("ahmedhussan068@gmail.com");
    expect(mail.replyTo).toBe("client@example.com");
    expect(mail.subject).toMatch(/^New consultation request from the KOMC website - /);
    expect(mail.text).toContain("Gender: male");
    expect(mail.text).toContain("Address: Dubai, UAE");
    expect(mail.text).toContain("Type of Inquiry: Maritime Law");
    expect(mail.text).toContain("Lead Source: KOMC website - Contact page");
    expect(mail.html).toContain("Please review the client details below");
    expect(mail.to).not.toContain("ahmedhussan068@gmail.com");
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
    expect(sendMailMock).not.toHaveBeenCalled();
  });
});

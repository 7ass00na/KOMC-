import { beforeEach, describe, expect, it, vi } from "vitest";

const sendMailMock = vi.fn();
const createTransportMock = vi.fn(() => ({
  sendMail: sendMailMock,
}));

vi.mock("nodemailer", () => ({
  default: {
    createTransport: createTransportMock,
  },
}));

describe("subscribe route", () => {
  beforeEach(() => {
    vi.resetModules();
    sendMailMock.mockReset();
    createTransportMock.mockClear();
    sendMailMock.mockResolvedValue({ messageId: "sub-1" });
    process.env.SMTP_HOST = "smtp.example.com";
    process.env.SMTP_PORT = "587";
    process.env.SMTP_USER = "mailer@example.com";
    process.env.SMTP_PASS = "secret";
    process.env.FROM_EMAIL = "no-reply@example.com";
  });

  it("sends newsletter subscriptions to the new recipient", async () => {
    const { POST } = await import("@/app/api/subscribe/route");

    const response = await POST(
      new Request("http://localhost/api/subscribe", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ email: "subscriber@example.com" }),
      }) as any
    );

    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(createTransportMock).toHaveBeenCalledOnce();
    expect(sendMailMock).toHaveBeenCalled();

    const mail = sendMailMock.mock.calls[0][0];
    expect(mail.to).toBe("info.khaledomer.adv2@khaledomer.ae");
    expect(mail.subject).toBe("KOMC Website Newsletter Subscription");
    expect(mail.text).toContain("subscriber@example.com");
  });

  it("rejects invalid newsletter emails", async () => {
    const { POST } = await import("@/app/api/subscribe/route");

    const response = await POST(
      new Request("http://localhost/api/subscribe", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ email: "invalid-email" }),
      }) as any
    );

    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe("invalid_email");
    expect(sendMailMock).not.toHaveBeenCalled();
  });
});

import React, { useState } from "react";
export default function BusinessInquiry() {
  const [status, setStatus] = useState("");
  function submit(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const subject = encodeURIComponent(
      "IT Support Inquiry — " + f.get("service"),
    );
    const body = encodeURIComponent(
      `Hello Thisara,\n\nMy name is ${f.get("name")}.\nEmail: ${f.get("email")}\nService: ${f.get("service")}\n\nIssue / requirements:\n${f.get("message")}\n\nThank you.`,
    );
    setStatus("Opening your email app with the inquiry.");
    location.href = `mailto:malingawelagedara523@gmail.com?subject=${subject}&body=${body}`;
  }
  return (
    <form className="contact-form" onSubmit={submit}>
      <h3>Discuss a future inquiry</h3>
      <p className="form-note">
        This form opens your email app with the details filled in.
      </p>
      <label htmlFor="inquiry-name">Your name</label>
      <input
        id="inquiry-name"
        name="name"
        required
        placeholder="Name or company"
      />
      <label htmlFor="inquiry-email">Email address</label>
      <input
        id="inquiry-email"
        name="email"
        type="email"
        required
        placeholder="you@company.com"
      />
      <label htmlFor="inquiry-service">What do you need help with?</label>
      <select id="inquiry-service" name="service">
        {[
          "Computer / Help Desk Support",
          "Network & Connectivity",
          "Security & System Hygiene",
          "IT Assets & Business Support",
          "Other / Not sure",
        ].map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>
      <label htmlFor="inquiry-message">Briefly describe the issue</label>
      <textarea
        id="inquiry-message"
        name="message"
        rows="4"
        required
        placeholder="Tell me what is happening…"
      />
      <button className="button primary submit-button" type="submit">
        Prepare email ↗
      </button>
      <small className="form-status" aria-live="polite">
        {status}
      </small>
    </form>
  );
}

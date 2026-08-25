import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const ASSETS = {
  socialShape: "https://www.figma.com/api/mcp/asset/5e08bce7-fd59-41c2-834b-49d3fcbb3ceb.png",
  arrow: "https://www.figma.com/api/mcp/asset/5b7b3dfb-4c5f-4d18-9253-5f89295ca5c0.svg",
  attach: "https://www.figma.com/api/mcp/asset/3237d6cb-f3df-4261-9621-6060222c58ce.svg",
  linkedin: "https://www.figma.com/api/mcp/asset/42e51374-9a50-4bc8-bac1-91e4374d0c18.svg",
  instagram: "https://www.figma.com/api/mcp/asset/8cf5f9f3-a4e0-4fa0-8a2c-86f7e52b4993.svg",
  vector: "https://www.figma.com/api/mcp/asset/fcf27ccb-77b9-451a-8002-4bd0f6d68e24.svg"
};

function App() {
  const [form, setForm] = useState({ name: "", email: "", project: "" });
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ type: "", text: "" });
  const [sending, setSending] = useState(false);

  const change = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  async function submit(event) {
    event.preventDefault();
    if (sending) return;

    setSending(true);
    setStatus({ type: "", text: "" });

    const data = new FormData();
    data.append("name", form.name);
    data.append("email", form.email);
    data.append("project", form.project);
    if (file) data.append("attachment", file);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: data
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not send the form.");
      }

      setForm({ name: "", email: "", project: "" });
      setFile(null);
      event.currentTarget.reset();
      setStatus({ type: "success", text: result.message });
    } catch (error) {
      setStatus({ type: "error", text: error.message });
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="desktop" data-node-id="2:919">
      <section className="contact-me" data-node-id="2:920">
        <div className="background-blur" data-node-id="2:921" />

        <div className="hero-copy" data-node-id="2:922">
          <a className="contact-label" href="#contact" data-node-id="2:924">
            Contact Me
          </a>
          <div className="label-line" data-node-id="2:925" />
          <h1 data-node-id="2:923">
            Let me know if you want to talk <br />
            about a potential collaboration. <br />
            I'm available for freelance work.
          </h1>
        </div>

        <a className="admin-email" href="mailto:infoname@mail.com" data-node-id="2:926">
          infoname@mail.com
        </a>

        <form id="contact" className="contact-form" onSubmit={submit} data-node-id="2:927">
          <label className="field" data-node-id="2:928">
            <input
              name="name"
              value={form.name}
              onChange={change}
              placeholder="What’s your name?"
              autoComplete="name"
              required
            />
            <span />
          </label>

          <label className="field" data-node-id="2:931">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={change}
              placeholder="Your email"
              autoComplete="email"
              required
            />
            <span />
          </label>

          <label className="field" data-node-id="2:934">
            <textarea
              name="project"
              value={form.project}
              onChange={change}
              placeholder="Tell me about your project"
              required
            />
            <span />
          </label>

          <div className="form-bottom">
            <button className="quote" type="submit" disabled={sending} data-node-id="2:946">
              Get a Quote
            </button>

            <div className="send-tools" data-node-id="2:937">
              <label className="attach-button" title={file ? file.name : "Attach a file"}>
                <input
                  type="file"
                  hidden
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,.zip"
                  onChange={(event) => setFile(event.target.files?.[0] || null)}
                />
                <img src={ASSETS.attach} alt="" />
              </label>

              <button className="send-button" type="submit" aria-label="Send" disabled={sending}>
                <img src={ASSETS.arrow} alt="" />
              </button>
            </div>
          </div>

          <div className={`status ${status.type}`} aria-live="polite">
            {status.text}
          </div>
        </form>

        <h2 className="friends" data-node-id="2:945">Let’s be Friends</h2>

        <div className="socials" data-node-id="2:949">
          <a className="social" href="#" aria-label="Social link">
            <img className="social-shape" src={ASSETS.socialShape} alt="" />
          </a>
          <a className="social" href="#" aria-label="Instagram">
            <img className="social-shape" src={ASSETS.socialShape} alt="" />
            <img className="social-icon" src={ASSETS.instagram} alt="" />
          </a>
          <a className="social" href="#" aria-label="LinkedIn">
            <img className="social-shape" src={ASSETS.socialShape} alt="" />
            <img className="social-icon" src={ASSETS.linkedin} alt="" />
          </a>
        </div>

        <img className="decor-vector" src={ASSETS.vector} alt="" />
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);

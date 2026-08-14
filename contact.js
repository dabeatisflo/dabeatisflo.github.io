(() => {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const startedAt = form.querySelector('[name="startedAt"]');
  const status = form.querySelector(".form-status");
  const button = form.querySelector("button[type='submit']");
  startedAt.value = String(Date.now());

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    button.disabled = true;
    status.className = "form-status sending";
    status.textContent = "Je aanvraag wordt veilig verzonden…";

    try {
      const data = Object.fromEntries(new FormData(form).entries());
      const response = await fetch(form.action, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Verzenden is momenteel niet gelukt.");

      form.reset();
      startedAt.value = String(Date.now());
      status.className = "form-status success";
      status.textContent = "Bedankt! Je aanvraag is verzonden. We nemen zo snel mogelijk contact op.";
    } catch (error) {
      status.className = "form-status error";
      status.textContent = error instanceof Error ? error.message : "Verzenden is momenteel niet gelukt.";
    } finally {
      button.disabled = false;
    }
  });
})();

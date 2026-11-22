const PHONE = "+989112362558";
const CONTACT_NAME = "Mr.Hosseini";
const EMAIL = "hosseinisepanta05@gmail.com";
const TELEGRAM = "https://t.me/SXYOo5";
const INSTAGRAM = "https://www.instagram.com/sepantahosseini46/";
const GITHUB = "https://github.com/sepanta-hosseini";
const LINKEDIN = "https://www.linkedin.com/in/sepanta-hosseini-56453039a/";

const yearElement = document.getElementById("year");
if (yearElement) yearElement.textContent = new Date().getFullYear();

function makeVCard(name = CONTACT_NAME, includeSocials = false) {
  const lines = [
    "BEGIN:VCARD", "VERSION:3.0", `FN:${name}`, `TEL;TYPE=CELL:${PHONE}`, `EMAIL:${EMAIL}`
  ];
  if (includeSocials) {
    lines.push(`URL:${TELEGRAM}`, `URL:${INSTAGRAM}`, `URL:${GITHUB}`, `URL:${LINKEDIN}`);
    lines.push("NOTE:Telegram and Instagram links included in this contact card");
  }
  lines.push("END:VCARD");
  return lines.join("\r\n");
}


function downloadVCard(name, includeSocials = false) {
  const blob = new Blob([makeVCard(name, includeSocials)], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = includeSocials ? "Sepanta-Contact-and-Socials.vcf" : "Mr-Hosseini.vcf";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const toast = document.getElementById("toast");
let toastTimer;
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 4800);
}

document.getElementById("saveContact")?.addEventListener("click", () => downloadVCard());
document.getElementById("downloadQrContact")?.addEventListener("click", () => downloadVCard(CONTACT_NAME, true));
document.getElementById("creatorNotice")?.addEventListener("click", () => {
  showToast("سازندگان آقای سپنتا حسینی و آقای کیان رحمتی هستن؛ فعلا سایتی ندارن ممنون که مهم بود براتون");
});

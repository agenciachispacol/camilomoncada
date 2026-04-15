export const site = {
  name: "Camilo Moncada",
  role: "AI para Emprendedores",
  initials: "CM",
  tagline:
    "Ayudo a emprendedores a crecer sus empresas con soluciones de Inteligencia Artificial.",
  subtagline:
    "Consultorías, clases virtuales y automatizaciones con IA hechas a la medida.",
  whatsapp: {
    number: "57320946700",
    message:
      "Hola Camilo, vi tu landing y quiero agendar una consultoría gratuita para crecer mi empresa con IA.",
  },
  cal: {
    namespace: "30min",
    link: "camilo-moncada-0kerld/30min",
  },
  socials: {
    instagram:
      "https://www.instagram.com/camilomoncada.ia?igsh=MWRnbGRwZWh3d3Bheg%3D%3D&utm_source=qr",
    tiktok: "https://www.tiktok.com/@camilomoncada.ia",
  },
};

export const whatsappUrl = `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(
  site.whatsapp.message,
)}`;

import Link from "next/link";
import { siteConfig } from "@/site.config";
import { Wordmark } from "./Wordmark";
import { ConsentSettingsButton } from "./ConsentBanner";

export function Footer() {
  const { contact, brand, social } = siteConfig;
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer on-dark">
      <div className="container">
        <div className="footer-top">
          <div>
            <Wordmark />
            <p className="small" style={{ marginTop: 24, maxWidth: 320 }}>
              {brand.tagline} Every journey is designed after a consultation and quoted individually.
            </p>
          </div>
          <div className="footer-cols">
            <div>
              <h2>Journeys</h2>
              <ul>
                <li><Link href="/journeys">All journeys</Link></li>
                <li><Link href="/journeys/private-migration-circuit">Private Migration Circuit</Link></li>
                <li><Link href="/journeys/rhino-and-big-cat-journey">Rhino &amp; Big Cat Journey</Link></li>
                <li><Link href="/journeys#pathways">Families, couples &amp; photographers</Link></li>
              </ul>
            </div>
            <div>
              <h2>Destinations</h2>
              <ul>
                <li><Link href="/destinations/maasai-mara">Maasai Mara</Link></li>
                <li><Link href="/destinations/lewa-laikipia">Lewa &amp; Laikipia</Link></li>
                <li><Link href="/destinations/chyulu-hills">Chyulu Hills</Link></li>
                <li><Link href="/experiences">Experiences</Link></li>
              </ul>
            </div>
            <div>
              <h2>Company</h2>
              <ul>
                <li><Link href="/our-approach">Our Approach</Link></li>
                <li><Link href="/journal">Journal</Link></li>
                <li><Link href="/private-consultation">Private Consultation</Link></li>
                {social.instagram && <li><a href={social.instagram} rel="me noopener">Instagram</a></li>}
                {social.linkedin && <li><a href={social.linkedin} rel="me noopener">LinkedIn</a></li>}
              </ul>
            </div>
            <div>
              <h2>Contact</h2>
              <ul>
                {contact.publicEmail && <li><a href={`mailto:${contact.publicEmail}`}>{contact.publicEmail}</a></li>}
                {contact.phone && <li><a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}>{contact.phone}</a></li>}
                {contact.whatsappUrl && <li><a href={contact.whatsappUrl} rel="noopener" target="_blank">WhatsApp</a></li>}
                <li><Link href="/private-consultation">Enquiry form</Link></li>
                <li><span className="small" style={{ color: "rgba(249,246,240,.6)" }}>Based in {brand.baseLocation}</span></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {year} {brand.name}</span>
          <span style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px" }}>
            <Link href="/privacy">Privacy</Link>
            <Link href="/cookies">Cookies</Link>
            <ConsentSettingsButton />
            <Link href="/image-credits">Image credits</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

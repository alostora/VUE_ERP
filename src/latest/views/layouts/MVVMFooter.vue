<template>
  <footer class="modern-footer">
    <!--  <div class="footer-wave">
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path
          d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
          opacity=".25"
          class="shape-fill"
        ></path>
        <path
          d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
          opacity=".5"
          class="shape-fill"
        ></path>
        <path
          d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
          class="shape-fill"
        ></path>
      </svg>
    </div> -->

    <div class="footer-content">
      <!-- Main Footer -->
      <!-- <div class="footer-main">
        <div class="footer-section company-info">
          <div class="footer-brand">
            <div class="brand-logo">
              <i class="pi pi-shield"></i>
            </div>
            <div class="brand-text">
              <h3 class="brand-title">{{ $t("app.title") }}</h3>
              <p class="brand-tagline">
                Modern Solutions for Modern Businesses
              </p>
            </div>
          </div>
          <p class="company-description">
            We provide cutting-edge ERP solutions that streamline operations,
            boost productivity, and drive growth for businesses of all sizes.
          </p>
          <div class="social-links">
            <a href="#" class="social-link" v-tooltip="'Follow us on Twitter'">
              <i class="pi pi-twitter"></i>
            </a>
            <a href="#" class="social-link" v-tooltip="'Connect on LinkedIn'">
              <i class="pi pi-linkedin"></i>
            </a>
            <a href="#" class="social-link" v-tooltip="'Like us on Facebook'">
              <i class="pi pi-facebook"></i>
            </a>
            <a href="#" class="social-link" v-tooltip="'Watch on YouTube'">
              <i class="pi pi-youtube"></i>
            </a>
            <a href="#" class="social-link" v-tooltip="'Star on GitHub'">
              <i class="pi pi-github"></i>
            </a>
          </div>
        </div>

        <div class="footer-section">
          <h4 class="section-title">Product</h4>
          <div class="footer-links">
            <a href="#" class="footer-link">
              <i class="pi pi-arrow-right"></i>
              Features
            </a>
            <a href="#" class="footer-link">
              <i class="pi pi-arrow-right"></i>
              Pricing
            </a>
            <a href="#" class="footer-link">
              <i class="pi pi-arrow-right"></i>
              Case Studies
            </a>
            <a href="#" class="footer-link">
              <i class="pi pi-arrow-right"></i>
              Updates
            </a>
            <a href="#" class="footer-link">
              <i class="pi pi-arrow-right"></i>
              Download
            </a>
          </div>
        </div>

        <div class="footer-section">
          <h4 class="section-title">Solutions</h4>
          <div class="footer-links">
            <a href="#" class="footer-link">
              <i class="pi pi-arrow-right"></i>
              Enterprise
            </a>
            <a href="#" class="footer-link">
              <i class="pi pi-arrow-right"></i>
              Small Business
            </a>
            <a href="#" class="footer-link">
              <i class="pi pi-arrow-right"></i>
              Startups
            </a>
            <a href="#" class="footer-link">
              <i class="pi pi-arrow-right"></i>
              Non-profits
            </a>
            <a href="#" class="footer-link">
              <i class="pi pi-arrow-right"></i>
              Education
            </a>
          </div>
        </div>

        <div class="footer-section">
          <h4 class="section-title">Resources</h4>
          <div class="footer-links">
            <a href="#" class="footer-link">
              <i class="pi pi-arrow-right"></i>
              Documentation
            </a>
            <a href="#" class="footer-link">
              <i class="pi pi-arrow-right"></i>
              Tutorials
            </a>
            <a href="#" class="footer-link">
              <i class="pi pi-arrow-right"></i>
              Blog
            </a>
            <a href="#" class="footer-link">
              <i class="pi pi-arrow-right"></i>
              Community
            </a>
            <a href="#" class="footer-link">
              <i class="pi pi-arrow-right"></i>
              Support
            </a>
          </div>
        </div>

        <div class="footer-section">
          <h4 class="section-title">Company</h4>
          <div class="footer-links">
            <a href="#" class="footer-link">
              <i class="pi pi-arrow-right"></i>
              About Us
            </a>
            <a href="#" class="footer-link">
              <i class="pi pi-arrow-right"></i>
              Careers
              <Badge value="3" severity="success" size="small" />
            </a>
            <a href="#" class="footer-link">
              <i class="pi pi-arrow-right"></i>
              Contact
            </a>
            <a href="#" class="footer-link">
              <i class="pi pi-arrow-right"></i>
              Partners
            </a>
            <a href="#" class="footer-link">
              <i class="pi pi-arrow-right"></i>
              Press Kit
            </a>
          </div>
        </div>

        <div class="footer-section newsletter">
          <h4 class="section-title">Stay Updated</h4>
          <p class="newsletter-text">
            Get the latest news and updates delivered to your inbox.
          </p>
          <div class="newsletter-form">
            <InputText
              placeholder="Enter your email"
              class="newsletter-input"
            />
            <Button
              icon="pi pi-send"
              class="newsletter-btn"
              severity="primary"
            />
          </div>
          <p class="newsletter-note">No spam, unsubscribe at any time.</p>
        </div>
      </div> -->

      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <div class="copyright-section">
            <div class="copyright">
              <strong
                >{{ $t("footer.copyright") }} &copy; 2024
                {{ $t("app.title") }}</strong
              >
              <span class="separator">•</span>
              <span>{{ $t("footer.rights") }}</span>
            </div>
            <div class="version-info">
              <i class="pi pi-code"></i>
              <span class="version-text"
                >{{ $t("footer.version") }} 2.4.18</span
              >
              <Badge value="Latest" severity="success" size="small" />
            </div>
          </div>

          <div class="legal-links">
            <a href="#" class="legal-link">Privacy Policy</a>
            <a href="#" class="legal-link">Terms of Service</a>
            <a href="#" class="legal-link">Cookie Policy</a>
            <a href="#" class="legal-link">Security</a>
            <a href="#" class="legal-link">GDPR</a>
          </div>

          <div class="footer-actions">
            <Button
              icon="pi pi-question-circle"
              text
              v-tooltip="'Help Center'"
            />
            <Button icon="pi pi-comments" text v-tooltip="'Live Chat'" />
            <Button icon="pi pi-flag" text v-tooltip="'Report Issue'" />
            <Button
              :icon="currentTheme === 'dark' ? 'pi pi-sun' : 'pi pi-moon'"
              text
              @click="toggleTheme"
              v-tooltip="currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode'"
            />
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Badge from "primevue/badge";
import Tooltip from "primevue/tooltip";

export default {
  directives: {
    tooltip: Tooltip,
  },
  components: {
    Button,
    InputText,
    Badge,
  },
  data() {
    return {
      currentTheme: localStorage.getItem("theme") || "light",
    };
  },
  methods: {
    toggleTheme() {
      this.currentTheme = this.currentTheme === "light" ? "dark" : "light";
      localStorage.setItem("theme", this.currentTheme);
      this.$emit("theme-changed", this.currentTheme);
    },
  },
};
</script>

<style scoped>
.modern-footer {
  background: var(--surface-card);
  border-top: 1px solid var(--surface-border);
  margin-top: auto;
  position: relative;
}

.footer-wave {
  position: absolute;
  top: -1px;
  left: 0;
  width: 100%;
  overflow: hidden;
  line-height: 0;
  transform: rotate(180deg);
}

.footer-wave svg {
  position: relative;
  display: block;
  width: calc(100% + 1.3px);
  height: 60px;
}

.footer-wave .shape-fill {
  fill: var(--surface-card);
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 4rem 1.5rem 1.5rem;
  position: relative;
  z-index: 1;
}

/* Main Footer */
.footer-main {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1.5fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

.footer-section.company-info {
  padding-right: 2rem;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.brand-logo {
  width: 50px;
  height: 50px;
  background: var(--gradient-primary);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.brand-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-tagline {
  font-size: 0.9rem;
  color: var(--text-color-secondary);
}

.company-description {
  color: var(--text-color-secondary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.social-links {
  display: flex;
  gap: 0.75rem;
}

.social-link {
  width: 40px;
  height: 40px;
  background: var(--surface-ground);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-color-secondary);
  text-decoration: none;
  transition: all 0.2s ease;
}

.social-link:hover {
  background: var(--primary-500);
  color: white;
  transform: translateY(-2px);
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--text-color);
  position: relative;
}

.section-title::after {
  content: "";
  position: absolute;
  bottom: -0.5rem;
  left: 0;
  width: 30px;
  height: 2px;
  background: var(--primary-500);
  border-radius: 1px;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color-secondary);
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  padding: 0.25rem 0;
}

.footer-link i {
  font-size: 0.8rem;
  transition: transform 0.2s ease;
}

.footer-link:hover {
  color: var(--primary-500);
  transform: translateX(5px);
}

.footer-link:hover i {
  transform: translateX(2px);
}

/* Newsletter */
.newsletter {
  background: var(--surface-ground);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--surface-border);
}

.newsletter-text {
  color: var(--text-color-secondary);
  font-size: 0.9rem;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.newsletter-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.newsletter-input {
  flex: 1;
}

.newsletter-btn {
  flex-shrink: 0;
}

.newsletter-note {
  font-size: 0.8rem;
  color: var(--text-color-secondary);
  opacity: 0.7;
}

/* Footer Bottom */
.footer-bottom {
  border-top: 1px solid var(--surface-border);
  padding-top: 1.5rem;
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.copyright-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.copyright {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color-secondary);
  font-size: 0.9rem;
}

.separator {
  opacity: 0.5;
}

.version-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--text-color-secondary);
}

.version-info i {
  font-size: 0.7rem;
}

.legal-links {
  display: flex;
  gap: 1.5rem;
}

.legal-link {
  color: var(--text-color-secondary);
  text-decoration: none;
  font-size: 0.8rem;
  transition: color 0.2s ease;
}

.legal-link:hover {
  color: var(--primary-500);
}

.footer-actions {
  display: flex;
  gap: 0.5rem;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .footer-main {
    grid-template-columns: 2fr 1fr 1fr 1fr;
  }

  .newsletter {
    grid-column: span 2;
  }
}

@media (max-width: 768px) {
  .footer-content {
    padding: 3rem 1rem 1rem;
  }

  .footer-main {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-section.company-info {
    padding-right: 0;
    text-align: center;
  }

  .footer-brand {
    justify-content: center;
  }

  .social-links {
    justify-content: center;
  }

  .newsletter {
    grid-column: span 1;
    text-align: center;
  }

  .footer-bottom-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .legal-links {
    flex-wrap: wrap;
    justify-content: center;
  }

  .footer-wave svg {
    height: 40px;
  }
}

/* Dark mode enhancements */
.dark-mode .footer-wave .shape-fill {
  fill: var(--surface-900);
}

.dark-mode .newsletter {
  background: var(--surface-800);
}

.dark-mode .social-link {
  background: var(--surface-700);
}

/* Animation for newsletter */
.newsletter-form :deep(.p-inputtext:focus) {
  box-shadow: 0 0 0 2px var(--primary-100);
}

/* Hover effects */
.footer-section:not(.company-info):not(.newsletter) .footer-links {
  padding-left: 0.5rem;
}

/* Badge animations */
:deep(.p-badge) {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
</style>

<template>
  <div
    class="login-container"
    :class="currentTheme"
    :dir="currentLanguage === 'ar' ? 'rtl' : 'ltr'"
  >
    <div class="login-background">
      <div class="background-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>
    </div>

    <div class="login-content" :class="contentDirection">
      <div class="login-form-panel">
        <div class="login-form-container modern-card">
          <div class="form-header">
            <h2 class="form-title">{{ $t("login.welcomeBack") }}</h2>
            <p class="form-subtitle">{{ $t("login.pleaseSignIn") }}</p>
          </div>

          <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-group">
              <label for="email" class="form-label">{{
                $t("login.email")
              }}</label>
              <div class="input-wrapper">
                <InputText
                  id="email"
                  v-model="form.user"
                  type="email"
                  :placeholder="$t('login.emailPlaceholder')"
                  class="modern-input"
                  :class="{ 'p-invalid': errors.user }"
                />
                <i
                  class="pi pi-envelope input-icon"
                  :class="inputIconClass"
                ></i>
              </div>
              <small v-if="errors.user" class="error-message">{{
                errors.user
              }}</small>
            </div>

            <div class="form-group">
              <label for="password" class="form-label">{{
                $t("login.password")
              }}</label>
              <div class="input-wrapper">
                <Password
                  id="password"
                  v-model="form.password"
                  :placeholder="$t('login.passwordPlaceholder')"
                  :feedback="false"
                  toggleMask
                  class="modern-input"
                  :class="{ 'p-invalid': errors.password }"
                  inputClass="w-full"
                />
                <i class="pi pi-lock input-icon" :class="inputIconClass"></i>
              </div>
              <small v-if="errors.password" class="error-message">{{
                errors.password
              }}</small>
            </div>

            <div class="form-options">
              <div class="remember-me">
                <Checkbox
                  v-model="form.rememberMe"
                  :binary="true"
                  inputId="rememberMe"
                />
                <label for="rememberMe" class="checkbox-label">{{
                  $t("login.rememberMe")
                }}</label>
              </div>
              <a href="#" class="forgot-password">{{
                $t("login.forgotPassword")
              }}</a>
            </div>

            <Button
              type="submit"
              :label="$t('login.signIn')"
              icon="pi pi-sign-in"
              class="login-btn modern-btn"
              :loading="loading"
            />

            <div class="divider">
              <span class="divider-text">{{ $t("login.orContinueWith") }}</span>
            </div>
            <div class="social-login">
              <Button
                :label="$t('login.google')"
                icon="pi pi-google"
                outlined
                class="social-btn"
                @click="socialLogin('google')"
              />
              <Button
                :label="$t('login.microsoft')"
                icon="pi pi-microsoft"
                outlined
                class="social-btn"
                @click="socialLogin('microsoft')"
              />
            </div>

            <div class="signup-link">
              {{ $t("login.noAccount") }}
              <a href="#" class="link" @click.prevent="showSignup = true">{{
                $t("login.signUp")
              }}</a>
            </div>
          </form>
        </div>

        <div class="login-actions">
          <Button
            @click="toggleTheme"
            :icon="currentThemeIcon"
            text
            rounded
            class="action-btn"
            v-tooltip.bottom="currentThemeTooltip"
          />
          <Button
            @click="toggleLanguage"
            :icon="currentLanguageIcon"
            text
            rounded
            class="action-btn"
            v-tooltip.bottom="currentLanguageTooltip"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import ToastService from "primevue/toastservice";
import general_request from "./layouts/constants/general_request"; // Correct path needed
// ...

export default {
  name: "LoginPage",
  components: {
    InputText,
    Password,
    Button,
    Checkbox,
  },
  data() {
    return {
      form: {
        user: "",
        password: "",
        rememberMe: false,
      },
      errors: {},
      loading: false,
      showSignup: false,
      currentTheme: localStorage.getItem("theme") || "light",
      currentLanguage: localStorage.getItem("language") || "en",
      // تم إلغاء features لعدم الحاجة إليها
    };
  },
  computed: {
    currentThemeIcon() {
      return this.currentTheme === "dark" ? "pi pi-sun" : "pi pi-moon";
    },
    currentThemeTooltip() {
      return this.currentTheme === "dark"
        ? "Switch to Light Mode"
        : "Switch to Dark Mode";
    },
    currentLanguageIcon() {
      return "pi pi-globe";
    },
    currentLanguageTooltip() {
      return this.currentLanguage === "en"
        ? "Switch to Arabic"
        : "Switch to English";
    },
    // ما زلنا نستخدم contentDirection لضبط موقع الأيقونات والروابط
    contentDirection() {
      return this.currentLanguage === "ar" ? "rtl-layout" : "ltr-layout";
    },
    inputIconClass() {
      return this.currentLanguage === "ar" ? "rtl-icon" : "ltr-icon";
    },
  },
  methods: {
    validateForm() {
      this.errors = {};

      if (!this.form.user) {
        this.errors.user = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(this.form.user)) {
        this.errors.user = "Email is invalid";
      }

      if (!this.form.password) {
        this.errors.password = "Password is required";
      } else if (this.form.password.length < 6) {
        this.errors.password = "Password must be at least 6 characters";
      }

      return Object.keys(this.errors).length === 0;
    },

    // --- Imports (Hypothetical, assuming you have services/stores) ---
    // import { useAuthStore } from '@/stores/auth';
    // import router from '@/router';
    // import { LoginService } from '@/services/LoginService';

    // ... inside methods: { ...

    async handleLogin() {
      if (!this.validateForm()) {
        return;
      }

      const API_URL = general_request.BASE_URL + "/auth/login"; // Use relative path if BASE_URL is configured in $http

      this.loading = true;
      this.errors.general = null;

      try {
        // 2. HTTP POST Request using the custom pattern
        const response = await this.$http.post(
          API_URL,
          this.form, // ⬅️ POST payload goes here (email, password, rememberMe)
          {
            // For POST requests, configuration (like headers) goes in the third argument
            headers: general_request.headers,
            // NOTE: axiosParams is typically NOT used for login payload,
            // but if your API expects email/password as query params, use it here:
            // params: this.axiosParams
          }
        );

        const data = response.data.data;

        if (response.data.status_code === 200 && data.token) {
          // Store ONLY the Token
          localStorage.setItem("authToken", data.token);

          // Success Feedback
          this.$toast.add({
            severity: "success",
            summary: "Welcome Back!",
            detail: `Signed in successfully.`,
            life: 3000,
          });

          // Smart Redirection
          const redirectPath = this.$route.query.redirect || "/";
          this.$router.push(redirectPath);
        } else {
          throw new Error("Login failed. Missing token in response.");
        }
      } catch (error) {
        // 6. Granular Error Handling (Same as before)
        this.$toast.add({ life: 4000 });

        if (error.response) {
          if (error.response.status === 401) {
            this.$toast.add({
              severity: "error",
              summary: "Authentication Failed",
              detail: "The email or password provided is incorrect.",
            });
            this.errors.password = "Incorrect credentials.";
          } else if (error.response.status === 429) {
            this.$toast.add({
              severity: "warn",
              summary: "Too Many Attempts",
              detail: "Please wait a minute before trying again.",
            });
          } else {
            this.$toast.add({
              severity: "error",
              summary: "Server Error",
              detail: "A server error occurred. Please try again later.",
            });
          }
        } else {
          this.$toast.add({
            severity: "error",
            summary: "Connection Error",
            detail: "Could not reach the server. Check your network.",
          });
        }
      } finally {
        // 7. Cleanup
        this.loading = false;
      }
    },

    socialLogin(provider) {
      this.$toast.add({
        severity: "info",
        summary: `${
          provider.charAt(0).toUpperCase() + provider.slice(1)
        } Login`,
        detail: `Redirecting to ${provider}...`,
        life: 2000,
      });
    },

    toggleTheme() {
      this.currentTheme = this.currentTheme === "light" ? "dark" : "light";
      localStorage.setItem("theme", this.currentTheme);
      this.applyTheme(this.currentTheme);
    },

    toggleLanguage() {
      this.currentLanguage = this.currentLanguage === "en" ? "ar" : "en";
      localStorage.setItem("language", this.currentLanguage);
      window.location.reload();
    },

    applyTheme(theme) {
      if (theme === "dark") {
        document.documentElement.classList.add("dark-mode");
        document.documentElement.classList.remove("light-mode");
      } else {
        document.documentElement.classList.add("light-mode");
        document.documentElement.classList.remove("dark-mode");
      }
    },
  },
  mounted() {
    this.applyTheme(this.currentTheme);
  },
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-ground);
  position: relative;
  overflow: hidden;
}

/* ... (تنسيقات الخلفية Shapes) ... */

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.background-shapes {
  position: relative;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: var(--primary-50);
  opacity: 0.1;
}

.shape-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  right: -150px;
  background: var(--gradient-primary);
}

.shape-2 {
  width: 200px;
  height: 200px;
  bottom: 100px;
  left: -100px;
  background: var(--gradient-secondary);
}

.shape-3 {
  width: 150px;
  height: 150px;
  top: 50%;
  right: 20%;
  background: var(--primary-500);
}

/* 🚀 التعديل الأهم: إلغاء Grid والاعتماد على Flexbox للتوسيط */
.login-content {
  display: flex; /* تحويل لـ Flexbox */
  justify-content: center; /* توسيط أفقي */
  align-items: center; /* توسيط عمودي (بالرغم من أن الأب container يغطيها) */
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  z-index: 1;
}

/* لا نحتاج لقواعد rtl-layout و ltr-layout هنا */

.login-form-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* للتأكد من تمركزه في حالة كانت login-content أكبر */
  margin: auto;
}

.login-form-container {
  width: 100%;
  max-width: 420px;
  padding: 2.5rem;
  background: var(--surface-card);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.form-subtitle {
  color: var(--text-color-secondary);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 500;
  color: var(--text-color);
}

.input-wrapper {
  position: relative;
}

.modern-input {
  width: 100%;
}

/* ⬅️ الإعداد العام لأيقونة الإدخال ➡️ */
.input-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-color-secondary);
  z-index: 2;
}

/* 1. LTR (الإنجليزية): الأيقونة على اليسار والـ Padding من اليسار */
.ltr-icon {
  left: 0.75rem;
  right: auto;
}

.modern-input.p-inputtext {
  padding-left: 2.5rem !important;
  padding-right: 1rem !important;
}

/* 2. RTL (العربية): الأيقونة على اليمين والـ Padding من اليمين */
.rtl-icon {
  right: 0.75rem;
  left: auto;
}

.rtl-layout .modern-input.p-inputtext {
  padding-right: 2.5rem !important;
  padding-left: 1rem !important;
}

/* 3. ضبط حقل كلمة المرور (Password Component) */
/* الافتراضي لـ LTR */
:deep(.p-password-input) {
  padding-left: 2.5rem !important;
  padding-right: 3.5rem !important; /* مسافة لزر toggleMask */
}

/* لضبطه في RTL */
.rtl-layout :deep(.p-password-input) {
  padding-right: 2.5rem !important;
  padding-left: 3.5rem !important; /* مسافة لزر toggleMask */
}

.error-message {
  color: var(--red-500);
  font-size: 0.875rem;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-label {
  color: var(--text-color);
  font-size: 0.9rem;
}

.forgot-password {
  color: var(--primary-500);
  text-decoration: none;
  font-size: 0.9rem;
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-btn {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
}

.divider {
  position: relative;
  text-align: center;
  margin: 1rem 0;
}

.divider::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--surface-border);
}

.divider-text {
  background: var(--surface-card);
  padding: 0 1rem;
  color: var(--text-color-secondary);
  font-size: 0.9rem;
}

.social-login {
  display: flex;
  gap: 1rem;
}

.social-btn {
  flex: 1;
}

.signup-link {
  text-align: center;
  color: var(--text-color-secondary);
  font-size: 0.9rem;
}

.link {
  color: var(--primary-500);
  text-decoration: none;
  font-weight: 500;
}

/* ⬅️ ضبط مسافة رابط التسجيل (Signup Link) ➡️ */
.ltr-layout .link {
  margin-left: 0.25rem;
  margin-right: 0;
}

.rtl-layout .link {
  margin-right: 0.25rem;
  margin-left: 0;
}

.link:hover {
  text-decoration: underline;
}

.login-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 2rem;
}

.action-btn {
  width: 3rem;
  height: 3rem;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .login-content {
    padding: 1rem;
  }
}

@media (max-width: 768px) {
  .login-content {
    padding: 1rem;
  }

  .login-form-container {
    padding: 2rem;
  }

  .social-login {
    flex-direction: column;
  }
}

/* Dark mode adjustments */
.dark-mode .feature-item,
.dark-mode .testimonial {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
}
</style>

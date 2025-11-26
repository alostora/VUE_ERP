import { createI18n } from 'vue-i18n'

// Import English translations
import enUsers from './locales/en/users'
import enCountries from './locales/en/country'
import enCommon from './locales/en/common'
import enAuth from './locales/en/auth'
import enValidation from './locales/en/validation'
import enErrors from './locales/en/errors'
import enGovernorate from './locales/en/governorate'
import enCities from './locales/en/city'
import enCompanies from './locales/en/company'
import enCategories from './locales/en/category'
import enMeasurementUnits from './locales/en/measurementUnit'
import enVariants from './locales/en/variant'
import enProducts from './locales/en/product'
import enFinalProducts from './locales/en/final_product'
import enFinalProductVariants from './locales/en/final_product_variant'
import enFinalProductImages from './locales/en/final_product_image'

// Import Arabic translations
import arUsers from './locales/ar/users'
import arCountries from './locales/ar/country'
import arCommon from './locales/ar/common'
import arAuth from './locales/ar/auth'
import arValidation from './locales/ar/validation'
import arErrors from './locales/ar/errors'
import arGovernorate from './locales/ar/governorate'
import arCities from './locales/ar/city'
import arCompanies from './locales/ar/company'
import arCategories from './locales/ar/category'
import arMeasuremartUnits from './locales/ar/measurementUnit'
import arVariants from './locales/ar/variant'
import arProducts from './locales/ar/product'
import arFinalProducts from './locales/ar/final_product'
import arFinalProductVariants from './locales/ar/final_product_variant'
import arFinalProductImages from './locales/ar/final_product_image'



const messages = {
     en: {
          ...enCommon,
          ...enAuth,
          ...enValidation,
          errors: enErrors,
          users: enUsers,
          countries: enCountries,
          governorates: enGovernorate,
          cities: enCities,
          companies: enCompanies,
          categories: enCategories,
          measurementUnits: enMeasurementUnits,
          variants: enVariants,
          products: enProducts,
          final_product: enFinalProducts,
          final_product_variants: enFinalProductVariants,
          final_product_images: enFinalProductImages
     },
     ar: {
          ...arCommon,
          ...arAuth,
          ...arValidation,
          errors: arErrors,
          users: arUsers,
          countries: arCountries,
          governorates: arGovernorate,
          cities: arCities,
          companies: arCompanies,
          categories: arCategories,
          measurementUnits: arMeasuremartUnits,
          variants: arVariants,
          products: arProducts,
          final_product: arFinalProducts,
          final_product_variants: arFinalProductVariants,
          final_product_images: arFinalProductImages
     }
}

const i18n = createI18n({
     legacy: false,
     locale: localStorage.getItem('language') || 'en',
     fallbackLocale: 'en',
     messages
})

export default i18n
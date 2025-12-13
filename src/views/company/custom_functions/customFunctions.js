export default {
     methods: {
          viewCities(item) {
               this.$router.push({
                    name: "cities",
                    params: { governorate_id: item.id },
               });
          },
     }
}
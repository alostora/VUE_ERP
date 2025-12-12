export default {
     methods: {
          viewGovernorates(item) {
               this.$router.push({
                    name: "governorates",
                    params: { country_id: item.id },
               });
          },
     }
}
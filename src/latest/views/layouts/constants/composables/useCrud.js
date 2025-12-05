import general_request from "../general_request";

export function useCrud() {
     return {
          data() {
               return {
                    selectedItem: null
               }
          },

          methods: {
               async deleteItem(item, baseUrl, successMessage, errorMessage) {
                    this.$confirm.require({
                         message: `Delete ${item.name || item.title || 'this item'}?`,
                         header: 'Confirmation',
                         icon: "pi pi-exclamation-triangle",
                         acceptClass: "p-button-danger",
                         accept: async () => {
                              try {
                                   this.loading = true;
                                   const url = `${baseUrl}/${item.id}`;
                                   await this.$http.delete(url, {
                                        headers: general_request.headers,
                                   });

                                   this.tableItems = this.tableItems.filter(i => i.id !== item.id);
                                   this.showToast("success", "Success", successMessage);
                              } catch (error) {
                                   this.showToast("error", "Error", errorMessage);
                              } finally {
                                   this.loading = false;
                              }
                         },
                         reject: () => {
                              // User rejected deletion
                         }
                    });
               },

               handleItemCreated(newItem) {
                    this.tableItems.unshift(newItem);
                    this.showToast("success", "Success", "Item created successfully");
               },

               handleItemUpdated(updatedItem) {
                    const index = this.tableItems.findIndex(item => item.id === updatedItem.id);
                    if (index !== -1) {
                         this.tableItems.splice(index, 1, updatedItem);
                    }
                    this.showToast("success", "Success", "Item updated successfully");
               }
          }
     }
}
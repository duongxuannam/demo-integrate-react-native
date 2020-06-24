const addressAutoComplete = (data) => ({
  isPickup: (data && data.isPickup) || false,
  destinationKey: (data && data.destinationKey) || 0,
  address: (data && data.address) || '',
});

export default addressAutoComplete;

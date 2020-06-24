export const configQuoteFormat = (input) => ({
  area_id: input.area_id || null,
  quote: input.vehicle_type || {
    id: null,
    total_fees: null,
    currency: '',
    estimated_time: null
  },
  vehicle_type: input.quote || {
    id: null,
    name: '',
    cargo_length: null,
    cargo_height: null,
    cargo_width: null,
    cargo_weight: null,
    cargo_cubic_meter: null,
    web_icon_url: '',
    mobile_icon_url: '',
    rating: null,
    review: null,
  },
});

const bookNowModal = {
  configQuoteFormat
};

export default bookNowModal;

const initState = {
  handleUnits: [],
  defaultHandleUnits: [],
  locationTypes: [],
  defaultLocationTypes: [],
  shipmentDetail: {},
  summaryShipment: [],
  defaultTransportTypes: [],
  defaultAdditionalServices: [],
  defaultLocationServices: [],
  total: 0,
  page: 0,
  totalPage: 1,
  sortFilter: 'Price',
  sortFilterOrder: '0',
  quoteItemsList: [],
  quoteAdvanceItem: {},
  isLoading: false,
  topLowestBid: 1,
};

const handleSummaryInShipment = (shipmentDetail) => {
  const source = [];
  if (shipmentDetail) {
    const objShipmentDetail = {
      type: 'detail',
      source: {
        title: shipmentDetail.title,
        description: `${shipmentDetail.id.slice(shipmentDetail.id.length - 5)}`,
      },
    };
    const objPickup = {
      type: 'location',
      source: {
        pickup: true,
        item: { ...shipmentDetail.addresses.pickup }
      },
    };

    source.push({ ...objShipmentDetail }, { ...objPickup });

    shipmentDetail.addresses.destinations.forEach((item) => {
      source.push({
        type: 'location',
        source: {
          pickup: false,
          item,
        }
      });
    });
    return {
      summaryShipment: source,
    };
  }
};

const mapQuoteDetailResult = (state, resultData) => {
  console.log('PAGE: ', resultData.data.totalPage, '--', state.page);
  let quoteList = [];
  if (resultData.data.totalPage === 1 && state.page === 0) {
    quoteList = [...resultData.data.items];
  } else if (resultData.data.totalPage <= (state.page + 2)) {
    quoteList = [...state.quoteItemsList, ...resultData.data.items];
  }
  return {
    quoteItemsList: quoteList,
    total: resultData.data.totalRecord,
    totalPage: resultData.data.totalPage,
    quoteAdvanceItem: resultData.data.advanceItem,
  };
};

const shipmentSate = {
  initState,
  handleSummaryInShipment,
  mapQuoteDetailResult
};

export default shipmentSate;

import { LISTING_ACTION, APP_ACTION, AUTH_ACTION } from '../actionTypes';
import listingState from '../states/listingState';
import { configQuoteFormat } from '../../model/bookNowModel';
import { QUERY, QUOTE_STATUS } from '../../constants/app';

const listingReducer = (state = listingState.initState, action) => {
  switch (action.type) {
    case LISTING_ACTION.GET_HANDLE_UNIT_SUCCESS:
      return {
        ...state,
        handleUnits: action.handleUnits,
      };
    case LISTING_ACTION.GET_HANDLE_UNIT_DEFAULT_SUCCESS:
      return {
        ...state,
        defaultHandleUnits: action.handleUnits,
      };
    case LISTING_ACTION.GET_LOCATION_TYPES_DEFAULT_SUCCESS:
      return {
        ...state,
        defaultLocationTypes: action.locationTypes,
      };
    case LISTING_ACTION.GET_TRANSPORT_TYPES_DEFAULT_SUCCESS:
      return {
        ...state,
        transportTypesDefault: action.transportTypes,
      };
    case LISTING_ACTION.GET_TRANSPORT_TYPES_SUCCESS:
      return {
        ...state,
        transportTypes: action.transportTypes,
      };

    case LISTING_ACTION.GET_ADDRESS_DATA_SUCCESS:
      return {
        ...state,
        locationTypes: action.locationTypes,
        locationServices: action.locationServices,
      };
    case LISTING_ACTION.GET_ADDITIONAL_SERVICES_SUCCESS:
      return {
        ...state,
        additionalServices: action.additionalServices,
      };
    case LISTING_ACTION.GET_ADDITIONAL_SERVICES_DEFAULT_SUCCESS:
      return {
        ...state,
        defaultAdditionalServices: action.defaultAdditionalServices,
      };
    case LISTING_ACTION.GET_LOCATION_SERVICES_DEFAULT_SUCCESS:
      return {
        ...state,
        defaultLocationServices: action.locationServices,
      };
    case LISTING_ACTION.GET_ADVERT_DESCRIPTION_SUCCESS:
      return {
        ...state,
        advertInfo: action.response,
      };
    case LISTING_ACTION.GET_LISTING_ITEMS_SUCCESS:
      return {
        ...state,
        listingItems: action.response,
      };
    case LISTING_ACTION.GET_SUMMARY_SUCCESS:
      return {
        ...state,
        ...listingState.handleSummary(action.response.shipmentItemDetail, action.response.shipmentAddress)
      };
    case LISTING_ACTION.GET_ADDRESS_SUCCESS:
      return {
        ...state,
        addresses: action.response,
      };
    case LISTING_ACTION.GET_QUOTE_ELEMENTS_SUCCESS:
      return {
        ...state,
        configQuote: action.response,
      };
    case LISTING_ACTION.SET_TEMP_BOOKING:
      return {
        ...state,
        ...listingState.setListingItemBooking(action.itemInfoListing),
      };
    case LISTING_ACTION.LISTING_SAVE_DRAFT_SUCCESS:
      return {
        ...state,
        ...listingState.setDraftItem(action.draftItem, action.draftId)
      };
    case LISTING_ACTION.SET_TEMP_GET_QUOTE:
      return {
        ...state,
        ...listingState.addGetQuoteData(state.getQuoteData, action.item)
      };
    case LISTING_ACTION.UPDATE_SHIPMENT_SUCCESS:
      return {
        ...state,
        shipmentId: action.response.id,
        draftId: null,
        draftItem: [],
        draftAddress: {},
        transportTypeId: null,
      };
    // UPDATE BASIC FIELD
    case LISTING_ACTION.UPDATE_PICKUP_ADDRESS:
    case LISTING_ACTION.UPDATE_DESTINATION_ADDRESS:
    case LISTING_ACTION.GET_DISTANCE_MATRIX_SUCCESS:
    case LISTING_ACTION.SAVE_ADDRESS_AS_DRAFT_SUCCESS:
    case LISTING_ACTION.SAVE_STATE_ADDRESS:
    case LISTING_ACTION.UPDATE_PICKUP_DATE:
    case LISTING_ACTION.SAVE_ADDRESS_QUOTE_FAILED:
      return {
        ...state,
        ...action.payload,
      };
    case LISTING_ACTION.SAVE_LISTING_ITEMS_SUCCESS:
      return {
        ...state,
        shipmentId: action.shipmentItems.id,
        targetPrice: action.targetPrice,
        unitPrice: action.unitPrice,
      };
    case LISTING_ACTION.LISTING_ITEMS_GET_QUOTE_SUCCESS:
      return {
        ...state,
        currentStep: 2,
        dataStep1: action.itemList,
        tempBooking: action.itemList,
        draftItem: action.itemList,
        ...listingState.upDataStep1Editing(state.dataStep1Editing, action.itemList, 'replace'),
      };
    case LISTING_ACTION.SAVE_ADDRESS_QUOTE_SUCCESS:
      return {
        ...state,
        ...action.payload,
        ...listingState.initialAddressState,
      };
    case LISTING_ACTION.HANDLE_SEND_SUCCESS:
      return {
        ...state,
        currentStep: 1,
        dataStep1: [],
        dataStep2: {
          pickup: {},
          destinations: []
        },
        pickupAddress: {},
        destinationAddress: {},
        tempAddress: [],
        tempBooking: [],
        pickupDate: null,
        isEditing: false,
        updatingAddress: false,
        dataStep1Editing: [],
        dataStep2Editing: {
          pickup: {},
          destinations: []
        },
        shipmentId: null,
        configQuote: configQuoteFormat({}),
        draftId: null,
        draftItem: [],
        draftAddress: {},
        transportTypeId: null,
      };
    case LISTING_ACTION.SET_TITLE_SHIPMENT:
      return {
        ...state,
        titleShipment: action.titleShipment,
        titleShort: action.titleShort,
        totalWeight: action.totalWeight,
      };
    case LISTING_ACTION.GET_SHIPMENT_DETAILS_SUCCESS:
      return {
        ...state,
        shipmentDetail: action.response.data,
        isEditing: false,
        ...listingState.handleSummaryInShipment(action.response.data, action.isDraftShipment)
      };
    case LISTING_ACTION.BOOK_AGAIN_SUCCESS:
      return {
        ...state,
        shipmentDetail: action.data,
        quoteDetail: {},
        ...listingState.handleSummaryInShipment(action.data),
        currentStep: 4,
      };
    case APP_ACTION.CHANGED_COUNTRY:
      return {
        ...state,
        currentStep: 1,
        pickupAddress: {},
        destinationAddress: {},
        dataStep1: [],
        dataStep2: {
          pickup: {},
          destinations: []
        },
        tempAddress: [],
        tempBooking: [],
        pickupDate: null,
        isEditing: false,
        updatingAddress: false,
        dataStep1Editing: [],
        dataStep2Editing: {
          pickup: {},
          destinations: []
        },
        shipmentId: null,
        configQuote: configQuoteFormat({}),
        draftId: null,
        draftItem: [],
        draftAddress: {},
      };
    case LISTING_ACTION.SET_EDITING_SUCCESS:
      return {
        ...state,
        isEditing: true,
        currentStep: 1,
        tempBooking: action.tempBooking,
        dataStep1Editing: action.tempBooking,
        updatingAddress: false,
        shipmentId: null,
        isDraftShipment: action.isDraftShipment,
      };
    case LISTING_ACTION.EDITING_STEP2:
      return {
        ...state,
        pickupAddress: {
          ...state.pickupAddress,
          ...action.pickupAddress,
        },
        destinationAddress: action.destinationAddress,
        dataStep2Editing: action.tempAddress,
        tempAddress: {
          ...state.tempAddress,
          ...action.tempAddress,
        },
        pickupDate: action.pickupDate,
      };
    case LISTING_ACTION.UN_LIST_SUCCESS:
      return {
        ...state,
        currentStep: 1,
        shipmentDetail: {
          ...state.shipmentDetail,
          status: action.response.status,
          statusValue: action.response.statusValue,
        },
      };
    case LISTING_ACTION.GET_DELETE_REASON_SUCCESS:
      return {
        ...state,
        deleteReasons: action.response,
      };
    case LISTING_ACTION.GET_REASONS_CANCEL_BOOKING_SUCCESS:
      return {
        ...state,
        cancelReasons: action.data,
      };
    case LISTING_ACTION.UPDATE_BASIC_SHIPMENT_SUCCESS:
      return {
        ...state,
        ...listingState.updateShipmentDetail(state, action.fieldsUpdate),
      };
    case LISTING_ACTION.UPLOAD_PHOTO_SHIPMENT_SUCCESS:
      return {
        ...state,
        shipmentDetail: {
          ...state.shipmentDetail,
          photos: [
            ...state.shipmentDetail.photos,
            ...action.photos,
          ],
        }
      };
    case LISTING_ACTION.DELETE_PHOTO_SHIPMENT_SUCCESS:
      return {
        ...state,
        ...listingState.updatePhotoShipment(state.shipmentDetail, action.photoId),
      };
    case LISTING_ACTION.UPDATING_ADDRESS:
      return {
        ...state,
        updatingAddress: true,
        updatingAddressData: action.address,
        imageRemoveSelected: [],
        imageUploadSelected: [],
      };
    case LISTING_ACTION.SET_DATA_ADDRESS_UPDATING_SUCCESS:
      return {
        ...state,
        ...listingState.setDataAddressUpdate(state, action.payload, action.index),
      };
    case LISTING_ACTION.REMOVE_ADDRESS_PHOTO:
      return {
        ...state,
        updatingAddressData: {
          ...state.updatingAddressData,
          ...listingState.removeAddressPhoto(state.updatingAddressData, action.file, action.index),
        }
      };
    case LISTING_ACTION.UPDATE_STATUS_ADDRESS_UPDATING:
      return {
        ...state,
        updatingAddress: false,
        imageUploadSelected: [],
        // imageRemoveSelected: [],
        updatingAddressData: {
          ...state.updatingAddressData,
          photos: [null, null, null],
        },
      };
    case LISTING_ACTION.EDIT_PICKUP_ADDRESS_SUCCESS:
    case LISTING_ACTION.UPDATE_DESTINATION_SHIPMENT_DETAIL:
      return {
        ...state,
        shipmentDetail: action.newShipmentDetail,
        ...listingState.updateSummaryShipment(state.summaryShipment, action.response)
      };
    case LISTING_ACTION.SET_PHOTO_REMOVE:
      return {
        ...state,
        imageRemoveSelected: [
          ...state.imageRemoveSelected,
          { ...action.photo },
        ],
        ...listingState.updateImageUploadSelected(state.imageUploadSelected, action.photo),
      };
    case LISTING_ACTION.EDITING_REMOVE_ITEM:
      return {
        ...state,
        ...listingState.upDataStep1Editing(state.dataStep1Editing, action.item, 'remove'),
      };
    case LISTING_ACTION.EDITING_ADD_ITEM:
    case LISTING_ACTION.EDITING_DUPLICATE_ITEM:
      return {
        ...state,
        dataStep1Editing: [
          ...state.dataStep1Editing,
          action.item,
        ]
      };
    case LISTING_ACTION.EDITING_REMOVE_ADDRESS:
      return {
        ...state,
        ...listingState.upDataStep2Editing(state, action.item, 'remove'),
      };
    case LISTING_ACTION.EDITING_DUPLICATE_ADDRESS:
    case LISTING_ACTION.EDITING_ADD_ADDRESS:
      return {
        ...state,
        dataStep2Editing: {
          ...state.dataStep2Editing,
          destinations: [
            ...state.dataStep2Editing.destinations,
            action.item,
          ]
        }
      };
    case LISTING_ACTION.EDITING_REPLACE_ADDRESS_DATA:
      return {
        ...state,
        ...listingState.upDataStep2Editing(state, action.dataStep2, 'replace'),
      };
    case LISTING_ACTION.UPDATE_DATA_FOR_MAP:
      return {
        ...state,
        shipmentDetail: action.newShipmentDetail,
      };
    case LISTING_ACTION.HANDLE_AFTER_EDIT_PICKUP_ADDRESS_SUCCESS:
      return {
        ...state,
        shipmentDetail: action.newShipmentDetail,
        ...listingState.parseSummaryShipment(action.newShipmentDetail, state.summaryShipment),
        imageRemoveSelected: [],
        imageUploadSelected: [],
      };
    case LISTING_ACTION.HANDLE_AFTER_EDIT_DESTINATION_ADDRESS_SUCCESS:
      return {
        ...state,
        shipmentDetail: action.newShipmentDetail,
        ...listingState.parseSummaryShipment(action.newShipmentDetail, state.summaryShipment),
        imageRemoveSelected: [],
        imageUploadSelected: [],
      };
    case LISTING_ACTION.GET_LIST_SHIPMENTS:
      return {
        ...state,
        isLoading: true,
      };
    case LISTING_ACTION.GET_LIST_SHIPMENTS_SUCCESS:
      return {
        ...state,
        ...listingState.mapShipmentResult(state, { ...action.data }),
        currentStep: 1,
        isLoading: false,
      };
    case LISTING_ACTION.GET_QUOTE_DETAIL_SUCCESS:
      return {
        ...state,
        quoteDetail: action.data,
        isLoading: false,
      };
    case LISTING_ACTION.GET_REASONS_REJECT_QUOTE_SUCCESS:
      return {
        ...state,
        reasonsRejectQuote: action.data,
      };
    case LISTING_ACTION.REJECT_QUOTE_SUCCESS:
      return {
        ...state,
        quoteDetail: {
          ...state.quoteDetail,
          items: state.quoteDetail.items.map((quote, index) => {
            if (quote.id === action.quoteId) {
              quote.status = QUOTE_STATUS.REJECTED
            }
            return quote;
          })
        },
      };
    case LISTING_ACTION.SET_FIELD_QUERY_SUCCESS:
      return {
        ...state,
        ...action.data,
      };
    case LISTING_ACTION.SET_DATA_FOR_QUERY_SUCCESS:
      return {
        ...state,
        ...listingState.mapShipmentResult(state, { ...action.data }),
        isLoading: false,
        resetFilter: false,
      };
    case LISTING_ACTION.REDIRECT_MANAGEMENT_SHIPMENTS_SUCCESS:
      return {
        ...state,
        resetFilter: true,
        tabFilter: QUERY.TAB_FILTER.PENDING,
        currentStep: 1,
        fromDate: '',
        toDate: '',
        textFilter: '',
        draftId: null,
        draftItem: [],
        draftAddress: {},
        tempAddress: {},
        tempBooking: [],
        dataStep1: [],
        dataStep1Editing: [],
        dataStep2: {},
        dataStep2Editing: {
          pickup: {},
          destinations: []
        },
        isDraftShipment: false,
      };
    case LISTING_ACTION.SET_CURRENT_STEP:
      return {
        ...state,
        currentStep: action.step,
      };
    case LISTING_ACTION.SET_PIN_SUCCESS:
      return {
        ...state,
        ...listingState.updateShipmentPinSuccess(state, action.shipmentId, action.pinStatus)
      };
    case LISTING_ACTION.DELETE_SHIPMENT_DATA_SUCCESS:
      return {
        ...state,
        ...listingState.updateDraftShipment(state, action.data.id, action.typeDelete),
      };
    case AUTH_ACTION.LOG_OUT:
      return {
        ...state,
        tempBooking: [],
        tempAddress: [],
      };
    case LISTING_ACTION.UPDATE_DRAFT_ITEMS:
      return {
        ...state,
        ...listingState.updateDraftItems(state.draftItem, action.items, action.typeUpdate),
      };
    case LISTING_ACTION.UPDATE_DRAFT_ADDRESS:
      return {
        ...state,
        ...listingState.updateDraftAddress(state, action.address, action.typeUpdate),
      };
    case LISTING_ACTION.SET_TRANSPORT_TYPE_ID:
      return {
        ...state,
        transportTypeId: action.transportTypeId,
      };
    case LISTING_ACTION.LISTING_DISCARD_DRAFT:
      return {
        ...state,
        dataStep1Editing: [],
        dataStep2Editing: {
          pickup: {},
          destinations: []
        },
      }
    default:
      return state;
  }
};

export default listingReducer;

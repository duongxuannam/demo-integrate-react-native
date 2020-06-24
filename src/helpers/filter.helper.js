import APP_CONSTANT from './constant.helper';

export const setPickupsFilter = (rootPickup, anotherPickup) => {
  const pickupsFilter = [];
  if (rootPickup && rootPickup.address) {
    pickupsFilter.push({
      location: {
        latitude: rootPickup.latitude,
        longitude: rootPickup.longitude,
      },
      address: rootPickup.address,
      radius: (rootPickup.radius || rootPickup.radius === 0) ? rootPickup.radius : APP_CONSTANT.DEFAULT_RADIUS,
      radiusUnit: 'km',
    });
  }

  anotherPickup.forEach((item) => {
    if (item && item.address) {
      pickupsFilter.push({
        location: {
          latitude: item.latitude,
          longitude: item.longitude,
        },
        address: item.address,
        radius: (item.radius || item.radius === 0) ? item.radius : APP_CONSTANT.DEFAULT_RADIUS,
        radiusUnit: 'km',
      });
    }
  });
  return pickupsFilter;
};

export const setDeliveryFilter = (rootDelivery, anotherDelivery) => {
  const deliveryFilter = [];
  if (rootDelivery && rootDelivery.address) {
    deliveryFilter.push({
      location: {
        latitude: rootDelivery.latitude,
        longitude: rootDelivery.longitude,
      },
      address: rootDelivery.address,
      radius: (rootDelivery.radius || rootDelivery.radius === 0) ? rootDelivery.radius : APP_CONSTANT.DEFAULT_RADIUS,
      radiusUnit: 'km',
    });
  }

  anotherDelivery.forEach((item) => {
    if (item && item.address) {
      deliveryFilter.push({
        location: {
          latitude: item.latitude,
          longitude: item.longitude,
        },
        address: item.address,
        radius: (item.radius || item.radius === 0) ? item.radius : APP_CONSTANT.DEFAULT_RADIUS,
        radiusUnit: 'km',
      });
    }
  });
  return deliveryFilter;
};

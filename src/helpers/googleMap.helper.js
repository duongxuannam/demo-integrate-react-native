export const getRegionForCoordinates = (points) => {
  // points should be an array of { latitude: X, longitude: Y }
  let minX; let maxX; let minY; let maxY;

  // init first point
  ((point) => {
    minX = point.latitude;
    maxX = point.latitude;
    minY = point.longitude;
    maxY = point.longitude;
  })(points[0]);

  // calculate rect
  points.map((point) => {
    minX = Math.min(minX, point.latitude);
    maxX = Math.max(maxX, point.latitude);
    minY = Math.min(minY, point.longitude);
    maxY = Math.max(maxY, point.longitude);
    return true;
  });

  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;
  let deltaX = (maxX - minX);
  let deltaY = (maxY - minY);
  deltaX += deltaX / 3;
  deltaY += deltaY / 3;

  return {
    latitude: midX,
    longitude: midY,
    latitudeDelta: deltaX,
    longitudeDelta: deltaY
  };
};

const googleMaps = {
  getRegionForCoordinates
};

export default googleMaps;

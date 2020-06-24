
const wrapJSONToHandleModel = (jsonData) => ({
  id: jsonData.id,
  name: jsonData.name,
  value: jsonData.id,
});

export default function LocationType(data) {
  return wrapJSONToHandleModel(data);
}

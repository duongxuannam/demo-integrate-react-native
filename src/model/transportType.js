
const wrapJSONToHandleModel = (jsonData) => ({
  icon: jsonData.iconUrl,
  name: jsonData.name,
  id: jsonData.id,
  description: jsonData.description,
  value: jsonData.id
});

export default function TransportType(data) {
  return wrapJSONToHandleModel(data);
}

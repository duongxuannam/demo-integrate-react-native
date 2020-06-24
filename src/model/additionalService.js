
const wrapJSONToServiceModel = (jsonData) => ({
  icon: jsonData.iconUrl,
  icon_active: jsonData.iconUrlActive,
  name: jsonData.name,
  id: jsonData.id,
  description: jsonData.description,
});

export default function AdditionalService(data) {
  return wrapJSONToServiceModel(data);
}

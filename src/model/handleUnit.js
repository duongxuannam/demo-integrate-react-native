
const wrapJSONToHandleModel = (jsonData) => ({
  icon: jsonData.iconUrl || jsonData.icon,
  name: jsonData.name,
  names: jsonData.pluralName,
  id: jsonData.id,
});

export default function HandleUnit(data) {
  return wrapJSONToHandleModel(data);
}

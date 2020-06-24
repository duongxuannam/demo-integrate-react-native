
const wrapJSONToHandleModel = (jsonData) => ({
  name: jsonData.name,
  id: jsonData.id,
});

export default function HandleUnit(data) {
  return wrapJSONToHandleModel(data);
}

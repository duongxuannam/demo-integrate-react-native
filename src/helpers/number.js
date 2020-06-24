const oneDay = 60 * 60 * 24;
export const getDayFromTimeAddress = (time, millisecond = false) => {
  try {
    if (!time) return '';
    const reg = new RegExp('^\\d+$');
    if (reg.test(time)) {
      return Math.ceil(time / (millisecond ? oneDay * 1000 : oneDay));
    }
    console.log('This is not a number:', time);
    return '';
  } catch (error) {
    console.log('Error from helper number:', error);
    return 0;
  }
};

export const newLastDate = (value = null) => {
  const newDate = value ? new Date(value) : new Date();
  // newDate.setHours(23, 59, 59, 999);
  return newDate;
};

export default getDayFromTimeAddress;

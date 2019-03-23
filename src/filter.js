// filter.js

/**
 * Создает разметку для фильтра
 *
 * @param {string} id часть id "filter-*" для элементов в разметке
 * @param {string} name отображаемое имя фильтра
 * @param {boolean} isChecked флаг определяющий атрибут checked фильтра
 *
 * @return {string} строка с разметкой фильтра
 */
const getFilter = (id, name, isChecked) => {
  const filterTemplate = `<input type="radio" id="filter-${id}" name="filter" value="${id}"${isChecked ? ` checked` : ``}>
<label class="trip-filter__item" for="filter-${id}">${name}</label>`;

  return filterTemplate;
};


export default getFilter;

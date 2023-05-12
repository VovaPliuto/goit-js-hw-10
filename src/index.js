import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetch-countries';
const debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const refs = {
  inputEl: document.getElementById('search-box'),
  listEl: document.querySelector('.country-list'),
  divEl: document.querySelector('.country-info'),
};

refs.inputEl.addEventListener('input', debounce(handleInput, DEBOUNCE_DELAY));

function handleInput(e) {
  if (!e.target.value) {
    return clearHTML();
  }

  fetchCountries(e.target.value.trim())
    .then(data => {
      console.log(data);
      if (data.length > 10) {
        clearHTML();

        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length >= 2) {
        clearHTML();

        refs.listEl.innerHTML = data
          .sort((a, b) => a.name.common.localeCompare(b.name.common))
          .reduce((acc, elem) => {
            return (
              acc +
              `<li class="country-item"><img src="${elem.flags.svg}" alt="${elem.name.official}" width="40"><span>${elem.name.common}</span></li>`
            );
          }, '');
      } else if (data.length === 1) {
        clearHTML();

        refs.divEl.innerHTML = `<div><div class="header"><img src="${
          data[0].flags.svg
        }" alt="${data[0].name.common}" width="40"><h2>${
          data[0].name.common
        }</h2></div><p><span class="values">Capital: </span>${
          data[0].capital
        }</p><p><span class="values">Population: </span>${
          data[0].population
        }</p><p><span class="values">Languages: </span>${Object.values(
          data[0].languages
        ).join(', ')}</p></div>`;
      }
    })
    .catch(error => {
      clearHTML();
      Notify.failure('Oops, there is no country with that name');
    });
}

function clearHTML() {
  refs.listEl.innerHTML = '';
  refs.divEl.innerHTML = '';
}

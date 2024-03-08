"use client";

import Image from "next/image";

import React from "react";
import moment from "moment";
import "moment-precise-range-plugin";
import { CountUp } from "countup.js";

function fechaActual() {
  const fechaNow = new Date();
  const yearNow = fechaNow.getUTCFullYear();
  const monthNow = fechaNow.getUTCMonth() + 1; //mes de 1 a 12
  const dayNow = fechaNow.getUTCDate(); //dia de 1 a 31
  const yearNowString = yearNow.toString().padStart(4, "0");
  const monthNowString = monthNow.toString().padStart(2, "0");
  const dayNowString = dayNow.toString().padStart(2, "0");
  const stringFechaActual = `${yearNowString}-${monthNowString}-${dayNowString}`;
  return [yearNow, monthNow, dayNow, stringFechaActual];
}
function daysToYearMonthDays(fechaActualObjetoDate, fechaIngresadaObjetoDate) {
  return moment.preciseDiff(
    fechaActualObjetoDate,
    fechaIngresadaObjetoDate,
    true
  );
}
export default function Home() {
  const [inputValue, setInputValue] = React.useState({
    day: "",
    month: "",
    year: "",
  });
  const [yearActual, monthActual, dayActual, fechaActualString] = fechaActual();
  const [estadosError, setEstadosError] = React.useState({
    day: { error: false, texto: "" },
    month: { error: false, texto: "" },
    year: { error: false, texto: "" },
  });

  function handleSubmit(eventObject) {
    eventObject.preventDefault();
    const maxminFechas = {
      day: { min: 1, max: 31, messagge: "Must be a valid day" },
      month: { min: 1, max: 12, messagge: "Must be a valid month" },
      year: { min: 1900, max: yearActual, messagge: "Must be in the past" },
    };

    if (
      Object.values(inputValue)
        .map((valorString) => +valorString)
        .some((valor, index) => {
          return (
            valor < Object.values(maxminFechas)[index].min ||
            valor > Object.values(maxminFechas)[index].max
          );
        })
    ) {
      checkRangeInput(maxminFechas);
    } else {
      const [isValidity, fechaString] = checkValidDate();
      if (isValidity) {
        const fechaActualObjetoDate = new Date(fechaActualString);
        const fechaIngresadaObjetoDate = new Date(fechaString);
        const {
          years: yearMostrar,
          months: monthMostrar,
          days: daysMostrar,
        } = daysToYearMonthDays(
          fechaActualObjetoDate,
          fechaIngresadaObjetoDate
        );
        if (fechaActualObjetoDate - fechaIngresadaObjetoDate < 0) {
          setEstadoInvalidDate(true);
        } else {
          setEstadoInvalidDate(false);

          //aca escribir el final

          const yearCountUpObject = new CountUp("year_span", yearMostrar);
          const monthCountUpObject = new CountUp("month_span", monthMostrar);
          const dayCountUpObject = new CountUp("day_span", daysMostrar);
          if (
            !yearCountUpObject.error &&
            !monthCountUpObject.error &&
            !dayCountUpObject.error
          ) {
            yearCountUpObject.start();
            monthCountUpObject.start();
            dayCountUpObject.start();
          } else {
            console.error("Error al crear los objetosCountup");
          }
        }
      }
    }
  }

  function checkRangeInput(maxminFechas) {
    const objetoEstadoRango = {};
    for (let elem of ["day", "month", "year"]) {
      if (elem != "year") {
        objetoEstadoRango[elem] =
          +inputValue[elem] < maxminFechas[elem].min ||
          +inputValue[elem] > maxminFechas[elem].max
            ? {
                [elem]: {
                  ...estadosError[elem],
                  error: true,
                  texto: maxminFechas[elem].messagge,
                },
              }
            : {};
      } else {
        objetoEstadoRango[elem] =
          +inputValue[elem] < maxminFechas[elem].min ||
          +inputValue[elem] > maxminFechas[elem].max
            ? {
                [elem]: {
                  ...estadosError[elem],
                  error: true,
                  texto:
                    +inputValue[elem] < maxminFechas[elem].min
                      ? "Must be upper 1900"
                      : maxminFechas[elem].messagge,
                },
              }
            : {};
      }
    }
    setEstadosError({
      ...estadosError,
      ...objetoEstadoRango.day,
      ...objetoEstadoRango.month,
      ...objetoEstadoRango.year,
    });
  }

  function checkValidDate() {
    try {
      const fechaIngresadafromDate = new Date(
        +inputValue.year,
        +inputValue.month - 1,
        +inputValue.day
      );
      fechaIngresadafromDate.setFullYear(+inputValue.year);
      const fechaIngresadaStringfromDate = fechaIngresadafromDate
        .toISOString()
        .substring(0, 10);
      const fechaIngresadaStringfromString = `${(+inputValue.year)
        .toString()
        .padStart(4, "0")}-${(+inputValue.month)
        .toString()
        .padStart(2, "0")}-${(+inputValue.day).toString().padStart(2, "0")}`;

      if (fechaIngresadaStringfromDate != fechaIngresadaStringfromString) {
        setEstadoInvalidDate(true);
        return [false, null];
      } else {
        setEstadoInvalidDate(false);
        return [true, fechaIngresadaStringfromString];
      }
    } catch (errorObject) {
      setEstadoInvalidDate(true);
      return [false, null];
    }
  }

  function setEstadoInvalidDate(estado) {
    if (estado) {
      setEstadosError({
        ...estadosError,
        day: { error: true, texto: "Must be a valid date" },
        month: { error: true, texto: "" },
        year: { error: true, texto: "" },
      });
    } else {
      setEstadosError({
        ...estadosError,
        day: { error: false, texto: "" },
        month: { error: false, texto: "" },
        year: { error: false, texto: "" },
      });
    }
  }

  function onClickSubmitButton() {
    const objetoEstado = {};
    for (let elem of ["day", "month", "year"]) {
      objetoEstado[elem] =
        inputValue[elem].length == 0
          ? {
              [elem]: {
                ...estadosError[elem],
                error: true,
                texto: "This field is required",
              },
            }
          : {};
    }
    setEstadosError({
      ...estadosError,
      ...objetoEstado.day,
      ...objetoEstado.month,
      ...objetoEstado.year,
    });
  }
  function handleInputData(evento) {
    const maxminFechas = {
      day: { min: 1, max: 31, messagge: "Must be a valid day" },
      month: { min: 1, max: 12, messagge: "Must be a valid month" },
      year: { min: 1900, max: yearActual, messagge: "Must be in the past" },
    };
    const dataIngresada = evento.nativeEvent.data;
    const nameInput = evento.nativeEvent.target.name;
    const valueInput = evento.target.value;
    if (/[0-9]+/.test(dataIngresada) || dataIngresada === null) {
      setInputValue({
        ...inputValue,
        [nameInput]:
          dataIngresada === null
            ? valueInput
            : valueInput.slice(0, -1) + dataIngresada,
      });
    } else {
      setInputValue({
        ...inputValue,
        [nameInput]: valueInput.slice(0, -1) + "",
      });
    }

    /*
    Validacion Campos en Blanco
    */

    updateStateEmptyInputs(nameInput, valueInput);
  }

  function handleInputFocus(evento) {
    const nameInput = evento.nativeEvent.target.name;
    const valueInput = evento.target.value;
    updateStateEmptyInputs(nameInput, valueInput);
  }

  function updateStateEmptyInputs(name, nameValue) {
    const nameInput = name;
    if (nameValue.length == 0) {
      setEstadosError({
        ...estadosError,
        [nameInput]: {
          ...estadosError[nameInput],
          error: true,
          texto: "This field is required",
        },
      });
    } else {
      setEstadosError({
        ...estadosError,
        [nameInput]: {
          ...estadosError[nameInput],
          error: false,
          texto: "",
        },
      });
    }
  }

  return (
    <>
      <main>
        <form id="formulario" onSubmit={handleSubmit}>
          <div className="contenedor_inputs">
            <div className="contenedor_input">
              <label
                htmlFor="input_day"
                className={estadosError.day.error ? "label_error" : ""}
              >
                DAY
              </label>
              <input
                type="text"
                name="day"
                value={inputValue.day}
                placeholder="DD"
                required
                onChange={handleInputData}
                onFocus={handleInputFocus}
                className={estadosError.day.error ? "input_error" : ""}
              />
              <p
                className={`mensaje_error ${
                  estadosError.day.error ? "mensaje_error_show" : ""
                }`}
              >
                {estadosError.day.error ? estadosError.day.texto : ""}
              </p>
            </div>
            <div className="contenedor_input">
              <label
                htmlFor="input_month"
                className={estadosError.month.error ? "label_error" : ""}
              >
                MONTH
              </label>
              <input
                type="text"
                name="month"
                value={inputValue.month}
                placeholder="MM"
                onChange={handleInputData}
                onFocus={handleInputFocus}
                required
                className={estadosError.month.error ? "input_error" : ""}
              />
              <p
                className={`mensaje_error ${
                  estadosError.month.error ? "mensaje_error_show" : ""
                }`}
              >
                {estadosError.month.error ? estadosError.month.texto : ""}
              </p>
            </div>
            <div className="contenedor_input">
              <label
                htmlFor="input_year"
                className={estadosError.year.error ? "label_error" : ""}
              >
                YEAR
              </label>
              <input
                type="text"
                name="year"
                value={inputValue.year}
                placeholder="YYYY"
                required
                onChange={handleInputData}
                onFocus={handleInputFocus}
                className={estadosError.year.error ? "input_error" : ""}
              />
              <p
                className={`mensaje_error ${
                  estadosError.year.error ? "mensaje_error_show" : ""
                }`}
              >
                {estadosError.year.error ? estadosError.year.texto : ""}
              </p>
            </div>
          </div>
          <div className="contenedor_boton">
            <div className="contenedor_boton_linea"></div>
            <button
              type="submit"
              onClick={onClickSubmitButton}
              title="Haz click para mostrar la diferencia"
            >
              <img src="/images/icon-arrow.svg" alt="button_arrow" />
            </button>
          </div>
        </form>
        <ul className="contenedor_age">
          <li>
            <span className="contenedor_age_number" id="year_span">
              --
            </span>
            <span>years</span>
          </li>
          <li>
            <span className="contenedor_age_number" id="month_span">
              --
            </span>
            <span>months</span>
          </li>
          <li>
            <span className="contenedor_age_number" id="day_span">
              --
            </span>
            <span>days</span>
          </li>
        </ul>
      </main>
      <footer>
        <div className="attribution">
          <p>
            <span>Challenge by:&nbsp;&nbsp;</span>
            <a
              href="https://www.frontendmentor.io?ref=challenge"
              target="_blank"
            >
              Frontend Mentor
            </a>
          </p>
          <p>
            <span>Coded by:&nbsp;</span>
            <a
              href="https://linktr.ee/waldohidalgo"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/images/firma_logo_negra.png" alt="logo waldo" />
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}

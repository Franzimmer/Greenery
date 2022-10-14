import styled from "styled-components";

const CalenderContainer = styled.div`
  .react-calendar {
    width: 70vw;
    padding: 20px;
    border: 1px solid #ddd;
    margin: auto;
  }

  /* ~~~ navigation styles ~~~ */
  .react-calendar__navigation {
    display: flex;

    .react-calendar__navigation__label {
      font-weight: 500;
    }

    .react-calendar__navigation__arrow {
      flex-grow: 0.333;
    }
  }

  /* ~~~ label styles ~~~ */
  .react-calendar__month-view__weekdays {
    text-align: center;
  }

  /* ~~~ button styles ~~~ */
  .react-calendar__month-view__days__day {
    height: 50px;
    background-color: ${(props) => props.theme.colors.main};
    border: 0;
    border-radius: 10px;
    color: #000;
    font-size: 16px;
    letter-spacing: 1px;
    padding: 5px 0;

    &:hover {
      background-color: ${(props) => props.theme.colors.second};
    }

    &:active {
      background-color: ${(props) => props.theme.colors.second};
    }
  }
  .react-calendar__navigation {
    align-items: center;
  }
  .react-calendar__navigation__arrow {
    font-size: 20px;
  }
  .react-calendar__month-view__weekdays {
    margin: 20px 0px 10px;
  }
  .react-calendar__month-view__weekdays__weekday abbr {
    text-transform: inherit;
    text-decoration: none;
    letter-spacing: 0;
    font-weight: 400;
    font-size: 16px;
  }
  .react-calendar__navigation__label span {
    font-size: 20px;
    letter-spacing: 2px;
  }
  /* ~~~ day grid styles ~~~ */
  .react-calendar__month-view__days {
    display: grid !important;
    grid-template-columns: repeat(7, 1fr);
    grid-gap: 10px;

    .react-calendar__tile {
      max-width: initial !important;
    }
  }

  /* ~~~ neighboring month & weekend styles ~~~ */
  .react-calendar__month-view__days__day--neighboringMonth {
    opacity: 0.7;
  }
  .react-calendar__month-view__days__day--weekend {
    color: #dfdfdf;
  }
  .react-calendar__tile--now:enabled,
  .react-calendar__tile--now:enabled:focus {
    background: ${(props) => props.theme.colors.second};
  }
  .react-calendar__tile--now:enabled:hover {
    background: #f5f0ec;
  }
  .react-calendar__month-view__days__day--weekend {
    color: #000;
  }
  .react-calendar__month-view__days__day:hover,
  .react-calendar__tile--active: enabled: hover {
    background: #f5f0ec;
  }

  .react-calendar__tile--active: enabled: focus {
    background: #f5f0ec;
  }
  @media (max-width: 650px) {
    .react-calendar__month-view__days__day {
      height: 50px;
      font-size: 14px;
    }
    .react-calendar__month-view__weekdays__weekday abbr {
      font-size: 14px;
    }
    .react-calendar__navigation__label span {
      font-size: 16px;
      letter-spacing: 1px;
    }
  }
  @media (max-width: 550px) {
    .react-calendar__month-view__days__day {
      height: 30px;
      font-size: 10px;
    }
    .react-calendar__month-view__weekdays__weekday {
      padding: 0;
    }
    .react-calendar__month-view__weekdays__weekday abbr {
      font-size: 10px;
    }
    .react-calendar__navigation__label span {
      font-size: 12px;
      letter-spacing: 0px;
    }
  }
`;

export default CalenderContainer;

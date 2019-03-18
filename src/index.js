import axios from 'axios';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  ControlLabel,
  FormControl,
  FormGroup,
  Grid,
  Row,
  Col,
} from 'react-bootstrap';

import './styles.css';

// example data
const exampleStocks = [
  { name: '2018-10-01', AAPL: 4000, MSFT: 2400, GOOGL: 2400 },
  { name: '2018-10-02', AAPL: 3000, MSFT: 1398, GOOGL: 2210 },
  { name: '2018-10-03', AAPL: 2000, MSFT: 9800, GOOGL: 2290 },
  { name: '2018-10-04', AAPL: 2780, MSFT: 3908, GOOGL: 2000 },
  { name: '2018-10-05', AAPL: 1890, MSFT: 4800, GOOGL: 2181 },
  { name: '2018-10-06', AAPL: 2390, MSFT: 3800, GOOGL: 2500 },
  { name: '2018-10-07', AAPL: 3490, MSFT: 4300, GOOGL: 2100 },
];

class App extends Component {
  constructor() {
    super();

    this.handleChange = this.handleChange.bind(this);

    this.state = {
      stocks: exampleStocks,
      inputValue: 'AMZN,FB',
    };
  }

  componentDidMount() {
    // const today = await axios(
    //   'https://api.iextrading.com/1.0/stock/aapl/quote'
    // );
    // console.log(today);
    // const threeMonths = await axios(
    //   'https://api.iextrading.com/1.0/stock/aapl/chart/3m'
    // );
    // console.log(threeMonths);
  }

  getValidationState() {
    const length = this.state.inputValue.length;
    if (length > 10) return 'success';
    else if (length > 0) return 'error';
    return null;
  }

  handleChange(e) {
    this.setState({ inputValue: e.currentTarget.value });
  }

  render() {
    return (
      <Grid fluid>
        <div className="App">
          <Row>
            <Col md={12}>
              <h1>Stocks</h1>

              <FormGroup
                controlId="formBasicText"
                validationState={this.getValidationState()}
              >
                <ControlLabel>
                  Enter stock symbols separated by commas
                </ControlLabel>

                <FormControl
                  type="text"
                  value={this.state.inputValue}
                  placeholder="AMZN,FB,AAPL,NVDA"
                  onChange={this.handleChange}
                />
                <FormControl.Feedback />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <h2>Last 3 Months</h2>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={this.state.stocks}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="AAPL" stroke="#8884d8" />
                  <Line type="monotone" dataKey="MSFT" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="GOOGL" stroke="#ffc658" />
                </LineChart>
              </ResponsiveContainer>
            </Col>
          </Row>
        </div>
      </Grid>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

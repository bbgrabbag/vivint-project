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
  Alert
} from 'react-bootstrap';

import './styles.css';

import { stocksUrl, parseStockData, genHexColor } from './utils/';

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
    this.handleSubmit = this.handleSubmit.bind(this);
    this._handleStockData = this._handleStockData.bind(this);
    this._validate = this._validate.bind(this);
    this.timeout = null;

    this.state = {
      stocks: exampleStocks,
      inputValue: 'AMZN,FB,GOOGL',
      apiErrMsg: null
    };
  }

  async componentDidMount() {
    this.handleSubmit();
  }

  _validate() {
    const { inputValue } = this.state;
    if (!this.state.inputValue.match(/^(([a-zA-Z]+,)*[a-zA-Z]+)$/)) return false
    if (inputValue.length > 0 && inputValue.length < 10) return false
    return true;
  }
  _handleStockData(data) {
    this.setState({ apiErrMsg: null, stocks: parseStockData(data) })
  }
  getValidationState() {
    return this._validate() ? 'success' : 'error';
  }
  async fetchStockData(stockSymbols) {
    const rawData = {}
    await Promise.all(stockSymbols.map(async stockSymbol => {
      const stockResponse = await axios.get(stocksUrl(stockSymbol));
      rawData[stockSymbol.toUpperCase()] = stockResponse.data
    }))
    return rawData;
  }
  handleSubmit() {
    const stockSymbols = this.state.inputValue.toLowerCase().split(',')
    this.fetchStockData(stockSymbols)
      .then(data => this._handleStockData(data))
      .catch(err => {
        this.setState({ apiErrMsg: err.message })
      })
  }
  handleChange(e) {
    clearTimeout(this.timeout);
    this.setState({ inputValue: e.currentTarget.value }, () => {
      if (this._validate()) this.timeout = setTimeout(this.handleSubmit, 1000)
    })
  }

  render() {
    const lineComponents = this.state.inputValue.split(',').map(symbol => {
      return <Line type='monotone' dataKey={symbol.toUpperCase()} stroke={genHexColor()} />
    })
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
              {this.state.apiErrMsg &&
                <Alert variant='danger'>
                  {this.state.apiErrMsg}
                </Alert>}
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
                  {lineComponents}
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

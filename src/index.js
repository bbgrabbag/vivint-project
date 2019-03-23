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
  Alert,
} from 'react-bootstrap';

import './styles.css';

import { stocksUrl, parseStockData, genHexColor } from './utils/';

class App extends Component {
  constructor() {
    super();

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this._handleStockData = this._handleStockData.bind(this);
    this._validate = this._validate.bind(this);
    this.timeout = null;

    this.state = {
      stocks: [],
      inputValue: 'AMZN,FB,GOOGL',
      symbols: ['AMZN', 'FB', 'GOOGL'],
      apiErrMsg: null,
      loading: true
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
    this.setState({ apiErrMsg: null, stocks: parseStockData(data), loading: false })
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
    this.setState({ loading: true }, () => this.fetchStockData(this.state.symbols)
      .then(data => this._handleStockData(data))
      .catch(err => {
        this.setState({ apiErrMsg: err.message, loading: false })
      }))
  }
  handleChange(e) {
    clearTimeout(this.timeout);
    this.setState({ inputValue: e.currentTarget.value, symbols: Array.from(new Set(e.currentTarget.value.toLowerCase().split(','))) }, () => {
      if (this._validate()) this.timeout = setTimeout(this.handleSubmit, 1000)
    })
  }

  render() {
    const lineComponents = this.state.symbols.map((symbol, i) => {
      return <Line key={i} type='monotone' dataKey={symbol.toUpperCase()} stroke={genHexColor()} />
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
                {this.state.loading ?
                  <div>...Loading</div>
                  :
                  <LineChart data={this.state.stocks}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    {lineComponents}
                  </LineChart>}
              </ResponsiveContainer>
            </Col>
          </Row>
        </div>
      </Grid>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

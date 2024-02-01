import React, { useState, useEffect } from 'react';
import axios from 'axios';  // You can use axios for fetching data
import HeatmapTable from './HeatMap';
import { Row, Col, Dropdown, DropdownButton, FormCheck, Form, InputGroup } from 'react-bootstrap';
import './App.css';

const stateMappings = {
    '19': 'Iowa', '56': 'Wyoming', '38': 'North Dakota', '16': 'Idaho', '49': 'Utah', '15': 'Hawaii', '33': 'New Hampshire', '44': 'Rhode Island', '02': 'Alaska', '11': 'District of Columbia', '30': 'Montana', '09': 'Connecticut', '32': 'Nevada', '01': 'Alabama', '34': 'New Jersey', '22': 'Louisiana', '28': 'Mississippi', '08': 'Colorado', '23': 'Maine', '35': 'New Mexico', '25': 'Massachusetts', '54': 'West Virginia', '31': 'Nebraska', '21': 'Kentucky', '41': 'Oregon', '20': 'Kansas', '46': 'South Dakota', '29': 'Missouri', '47': 'Tennessee', '45': 'South Carolina', '50': 'Vermont', '78': 'Virgin Islands', '53': 'Washington', '05': 'Arkansas', '10': 'Delaware', '60': 'American Samoa', '72': 'Puerto Rico', '55': 'Wisconsin', '27': 'Minnesota', '40': 'Oklahoma', '12': 'Florida', '13': 'Georgia', '39': 'Ohio', '37': 'North Carolina', '26': 'Michigan', '36': 'New York', '24': 'Maryland', '18': 'Indiana', '17': 'Illinois', '51': 'Virginia', '42': 'Pennsylvania', '06': 'California', '48': 'Texas', '04': 'Arizona', 'US': 'United States'
  };
  
const ShapeForecastApp = () => {
    const [data, setData] = useState(null);
    const [state, setState] = useState("06");
    const [availableModels, setAvailableModels] = useState([]);
    const [selectedModels, setSelectedModels] = useState(["COVIDhub-baseline", "COVIDhub-4_week_ensemble"]);
    const [dates, setDates] = useState([]);
    const [date, setDate] = useState("");
    const [shapeType, setShapeType] = useState("");
    const [plotData, setPlotData] = useState([]);
    const [agreementValue, setAgreementValue] = useState(0.8); // New state for agreement value
    const customMarginStyle = {
        marginLeft: '20px',  // Left margin
        marginTop: '20px',   // Top margin
        marginRight: '20px', // Right margin
        marginBottom: '20px' // Bottom margin
    };
    const gradientBackgroundStyle = {
        background: 'linear-gradient(180deg, #333, #1c1c1c)', // This creates a light black gradient
        color: 'white', // This sets the text color to white for all child elements
    };
    const handleModelSelect = (event) => {
      const selectedOptions = Array.from(event.target.selectedOptions).map(option => option.value);
      setSelectedModels(selectedOptions);
  };
  const handleModelCheckboxChange = (model) => {
    setSelectedModels(prevModels => {
      if (prevModels.includes(model)) {
        return prevModels.filter(m => m !== model);
      } else {
        return [...prevModels, model];
      }
    });
  };

    useEffect(() => {
        // Fetch data from an endpoint (converted to JSON from the pickle file)
        axios.get('https://raw.githubusercontent.com/smdp2000/data_dump/main/covid_data.json').then(response => {
          //console.log(response.data)
            const responseData = response.data;
            setData(responseData);
            //setState(Object.keys(response.data.all_shapelet_reps)[0]);
            setData(responseData);
            setDate(Object.keys(responseData)[4]);            
            setShapeType('Median Shape');
            setDates(Object.keys(responseData))
        });
    }, []);

    useEffect(() => {
        if (data && date && state) {
          // Access the data for the current date and state
          const currentStateData = data[date] && data[date].all_shapelet_reps ? data[date].all_shapelet_reps[state] : {};
          const newAvailableModels = Object.keys(currentStateData);
      
          setAvailableModels(newAvailableModels);
      
          // Access the agreement value for the current date and state
          const newAgreementValue = data[date] && data[date].all_agreements ? data[date].all_agreements[state] : 0;
          setAgreementValue(newAgreementValue);
      
          // Keep only the models that are both selected and available for the new date and state
          setSelectedModels(prevSelectedModels => prevSelectedModels.filter(model => newAvailableModels.includes(model)));
        }
      }, [data, date, state]); // Add 'date' as a dependency

      useEffect(() => {
        if (data && date && state && selectedModels && shapeType) {
            const dataSource = shapeType === 'Median Shape' ? data[date].all_shapelet_reps : data[date].all_shapelet_reps_prob;
            const modelData = selectedModels
                .map(model => dataSource && dataSource[state] && dataSource[state][model])
                .filter(Boolean); // Ensure we don't include undefined values
            setPlotData(modelData);
        }
    }, [date, data, state, selectedModels, shapeType]);

    // Render the components
    return (
        <div >
        <h1 className="text-center" style={customMarginStyle}>Shape Forecast</h1>
        <p className="text-center">This application visualizes shape forecasts from various models. Select different parameters to customize the forecasts displayed.</p>
            <hr />

            <Row className="d-flex justify-content-center" style={customMarginStyle}>
            <Col md={3}>
                <Form.Group controlId="stateSelect">
                    <Form.Label>Select State</Form.Label>
                    <Form.Control as="select" value={state} onChange={e => setState(e.target.value)}>
                    {Object.keys(data && data[date] ? data[date].all_shapelet_reps : {}).map(stateKey => (
      <option key={stateKey} value={stateKey}>
        {stateMappings[stateKey]}
      </option>
    ))}
                    </Form.Control>
                </Form.Group>
            </Col>

            <Col md={3}>
                <Form.Group controlId="modelSelect">
                    <Form.Label>Select Models</Form.Label>
                    <DropdownButton title="Select Models" variant="outline-secondary" style={{ width: '100%' }}>
                        {availableModels.map(model => (
                            <Dropdown.Item key={model} className="w-100">
                                <FormCheck
                                    type="checkbox"
                                    label={model}
                                    checked={selectedModels.includes(model)}
                                    onChange={() => handleModelCheckboxChange(model)}
                                />
                            </Dropdown.Item>
                        ))}
                    </DropdownButton>
                </Form.Group>
            </Col>

            <Col md={3}>
                <Form.Group controlId="dateSelect">
                    <Form.Label>Select Date</Form.Label>
                    <Form.Control as="select" value={date} onChange={e => setDate(e.target.value)}>
                    {dates.map(date => (
                            <option key={date} value={date}>
                                {date}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>
            </Col>

            <Col md={3}>
                <Form.Group>
                    <Form.Label>Select Shape</Form.Label>
                    <div>
                        <Form.Check 
                            inline 
                            type="radio" 
                            label="Median" 
                            value="Median Shape" 
                            checked={shapeType === 'Median Shape'} 
                            onChange={e => setShapeType(e.target.value)} 
                        />
                        <Form.Check 
                            inline 
                            type="radio" 
                            label="Probabilistic" 
                            value="Probabilistic Shape" 
                            checked={shapeType === 'Probabilistic Shape'} 
                            onChange={e => setShapeType(e.target.value)} 
                        />
                    </div>
                </Form.Group>
            </Col>
        </Row>
        <Row className="d-flex justify-content-center my-4">
                <Col md={6}>
                    <InputGroup className="mb-2">
                        <InputGroup.Text>Agreement Value:</InputGroup.Text>
                        <Form.Control
                            type="range"
                            value={agreementValue}
                            min="0.0"
                            max="1.0"
                            step="0.01"
                            disabled
                        />
                        <InputGroup.Text>{agreementValue.toFixed(2)}</InputGroup.Text>
                    </InputGroup>
                </Col>
            </Row>
        <div className="heatmap-container" style={{ marginTop: '50px' }}>

            {<HeatmapTable 
    data={plotData} 
    shapeletNames={data && data[date] ? data[date].shapelet_names : [] } 
    modelNames={selectedModels}
/>}
</div>

        </div>
    );
}

export default ShapeForecastApp;

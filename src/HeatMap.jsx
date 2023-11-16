import { Table, Container, Row, Image, OverlayTrigger, Tooltip } from 'react-bootstrap';
import './App.css';

const HeatmapTable = ({ data = [], shapeletNames = [], modelNames = [] }) => {
    const getColor = value => {
        if (value === 0) {
            return '#ffffff'; // white for neutral/zero
        } else if (value < 0) {
            // Blue for negative
            const intensity = Math.round(255 * (1 + value)); // Lighter to full blue for -1 to 0
            return `rgb(${intensity}, ${intensity}, 255)`;
        } else {
            // Red for positive
            const intensity = Math.round(255 * (1 - value)); // Full to lighter red for 0 to 1
            return `rgb(255, ${intensity}, ${intensity})`;
        }
    };

    const renderTooltip = (props, value) => (
        <Tooltip id="button-tooltip" {...props}>
            Value: {value.toFixed(2)}
        </Tooltip>
    );

    const gradientBarStyle = {
        background: "linear-gradient(to bottom, rgb(0, 0, 255) 0%, #ffffff 50%, rgb(255, 0, 0) 100%)",
        height: "100px",
        width: "20px",
        margin: "0 10px",
    };

    const labelStyle = {
        position: "absolute", 
        left: "-14px", // Position the labels to the left of the bar
        fontSize: "0.8rem", // Adjust font size as needed
    };

    const images = ['/Inc.png', '/peak.png', '/dec.png', '/flat.png'];

    return (
        <Container>
            <Row className="justify-content-md-center">
                <div style={{ display: "flex", width: "100%", overflowX: "auto" }}>
                    <div style={{ flexGrow: 1 }}>
                        <Table responsive="md" className="heatmap-table">
                            <thead>
                                <tr>
                                    <th></th>
                                    {images.map((src, index) => (
                                        <th key={index} style={{ textAlign: 'center' }}>
                                            <Image src={process.env.PUBLIC_URL + src} alt={`Image ${index}`} thumbnail width={100} />
                                        </th>
                                    ))}
                                </tr>
                                <tr>
                                    <th></th>
                                    {shapeletNames.map((name, index) => (
                                        <th key={index} style={{ textAlign: 'center' }}>{name}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        <td>{modelNames[rowIndex]}</td>
                                        {row.map((value, colIndex) => (
                                            <td key={colIndex} style={{ minWidth: '150px', backgroundColor: getColor(value) }}>
                                                <OverlayTrigger
                                                    placement="top"
                                                    delay={{ show: 250, hide: 400 }}
                                                    overlay={(props) => renderTooltip(props, value)}
                                                >
                                                    <span style={{ display: "block", height: "100%" }}>&nbsp;</span>
                                                </OverlayTrigger>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                    <div style={{ flexShrink: 0 }}>
                        <div className="gradient-bar" style={gradientBarStyle}>
                            <div style={{ position: "relative", height: "100%" }}>
                                <span style={{ ...labelStyle, top: 0 }}>-1</span>
                                <span style={{ ...labelStyle, top: "45%" }}>0</span>
                                <span style={{ ...labelStyle, bottom: 0 }}>1</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Row>
        </Container>
    );
};

export default HeatmapTable;

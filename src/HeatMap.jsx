import { Table, Container, Row, Col, Image, OverlayTrigger, Tooltip } from 'react-bootstrap';
import './App.css';

const HeatmapTable = ({ data = [], shapeletNames = [], modelNames = [] }) => {
    const getColor = value => {
        const normalized = (value + 1) / 2;
        const intensity = Math.round(255 * (1 - normalized));
        return `rgb(255, ${intensity}, ${intensity})`;
    };

    const renderTooltip = (props, value) => (
        <Tooltip id="button-tooltip" {...props}>
            Value: {value.toFixed(2)}
        </Tooltip>
    );

    const gradientBarStyle = {
        background: "linear-gradient(to bottom, #ffffff 0%, rgb(255, 0, 0) 100%)",
        height: "100px",
        width: "20px",
        margin: "0 10px"
    };

    const images = ['/Inc.png', '/peak.png', '/dec.png', '/flat.png'];

    return (
        <Container>
            <Row className="justify-content-md-center">
                <div style={{ display: "flex", width: "100%", overflowX: "auto" }}>
                    <div style={{ flexGrow: 1, maxWidth: "calc(100% - 50px)" }}>
                        <Table responsive="md" className="heatmap-table">
                            <thead>
                                <tr>
                                    <th></th>
                                    {images.map((src, index) => (
                                        <th key={index} style={{ textAlign: 'center' }}>
                                            <Image src={src} alt={`Image ${index}`} thumbnail width={100} />
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
                    <div style={{ width: "50px", flexShrink: 0 }}>
                        <div className="gradient-bar" style={gradientBarStyle}>
                            <div style={{ position: "relative", height: "100%" }}>
                                <span style={{ position: "absolute", top: 0, right: "25px" }}>-1</span>
                                <span style={{ position: "absolute", top: "45%", right: "25px" }}>0</span>
                                <span style={{ position: "absolute", bottom: 0, right: "25px" }}>1</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Row>
        </Container>
    );
};

export default HeatmapTable;

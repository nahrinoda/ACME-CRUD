import React, { Component } from "react";
import { Message, Button, Form, Select } from "semantic-ui-react";
import axios from "axios";

const deviceStatus = [
  { key: "on", text: "ON", value: "ON" },
  { key: "off", text: "OFF", value: "OFF" },
  { key: "unavailable", text: "UNAVAIL", value: "UNAVAIL" }
];

class FormUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      deviceName: "",
      deviceTmail: "",
      sensorName: "",
      dStatus: "",
      formClassName: "",
      formSuccessMessage: "",
      formErrorMessage: ""
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    // Fill in the form with the appropriate data if user id is provided
    if (this.props.userID) {
      axios
        .get(`${this.props.server}/api/users/${this.props.userID}`)
        .then(response => {
          this.setState({
            deviceName: response.data.deviceName,
            deviceType: response.data.deviceType,
            sensorName:
              response.data.sensorName === null ? "" : response.data.sensorName,
            dStatus: response.data.dStatus
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  handleInputChange(e) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({ [name]: value });
  }

  handleSelectChange(e, data) {
    this.setState({ dStatus: data.value });
  }

  handleSubmit(e) {
    // Prevent browser refresh
    e.preventDefault();

    const user = {
      deviceName: this.state.deviceName,
      deviceType: this.state.deviceType,
      sensorName: this.state.sensorName,
      dStatus: this.state.dStatus
    };

    // Acknowledge that if the user id is provided, we're updating via PUT
    // Otherwise, we're creating a new data via POST
    const method = this.props.userID ? "put" : "post";
    const params = this.props.userID ? this.props.userID : "";

    axios({
      method: method,
      responseType: "json",
      url: `${this.props.server}/api/users/${params}`,
      data: user
    })
      .then(response => {
        this.setState({
          formClassName: "success",
          formSuccessMessage: response.data.msg
        });

        if (!this.props.userID) {
          this.setState({
            deviceName: "",
            deviceType: "",
            sensorName: "",
            dStatus: ""
          });
          this.props.onUserAdded(response.data.result);
          this.props.socket.emit("add", response.data.result);
        } else {
          this.props.onUserUpdated(response.data.result);
          this.props.socket.emit("update", response.data.result);
        }
      })
      .catch(err => {
        if (err.response) {
          if (err.response.data) {
            this.setState({
              formClassName: "warning",
              formErrorMessage: err.response.data.msg
            });
          }
        } else {
          this.setState({
            formClassName: "warning",
            formErrorMessage: "Something went wrong. " + err
          });
        }
      });
  }

  render() {
    const formClassName = this.state.formClassName;
    const formSuccessMessage = this.state.formSuccessMessage;
    const formErrorMessage = this.state.formErrorMessage;

    return (
      <Form className={formClassName} onSubmit={this.handleSubmit}>
        <div className="modal">
          <Form.Input
            label="Device Name"
            type="text"
            placeholder="Device-1"
            name="deviceName"
            maxLength="40"
            required
            value={this.state.deviceName}
            onChange={this.handleInputChange}
          />
          <Form.Input
            label="Device Type"
            type="text"
            placeholder="Car"
            name="deviceType"
            required
            value={this.state.deviceType}
            onChange={this.handleInputChange}
          />
          <Form.Group widths="equal">
            <Form.Input
              label="Sensor Name"
              type="text"
              placeholder="Sensor-1"
              name="sensorName"
              value={this.state.sensorName}
              onChange={this.handleInputChange}
            />
            <Form.Field
              control={Select}
              label="Device Status"
              options={deviceStatus}
              placeholder="Device Status"
              value={this.state.dStatus}
              onChange={this.handleSelectChange}
            />
          </Form.Group>
        </div>
        <Message
          success
          color="green"
          header="Nice one!"
          content={formSuccessMessage}
        />
        <Message
          warning
          color="yellow"
          header="Woah!"
          content={formErrorMessage}
        />
        <Button color={this.props.buttonColor} floated="right">
          {this.props.buttonSubmitTitle}
        </Button>
        <br />
        <br /> {/* Yikes! Deal with Semantic UI React! */}
      </Form>
    );
  }
}

export default FormUser;

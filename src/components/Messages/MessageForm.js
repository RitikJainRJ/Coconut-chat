import React from "react";
import firebase from "../../firebase";
import { Segment, Button, Input } from "semantic-ui-react";
import { Picker, emojiIndex } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";

class MessageForm extends React.Component {
  state = {
    message: "",
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    loading: false,
    errors: [],
    emojiPicker: false,
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleTogglePicker = () => {
    this.setState({ emojiPicker: !this.state.emojiPicker });
  };

  handleAddEmoji = (emoji) => {
    const oldMessage = this.state.message;
    const newMessage = this.colonToUnicode(` ${oldMessage} ${emoji.colons} `);
    this.setState({ message: newMessage, emojiPicker: false });
    setTimeout(() => this.messageInputRef.focus(), 0);
  };

  colonToUnicode = (message) => {
    return message.replace(/:[A-Za-z0-9_+-]+:/g, (x) => {
      x = x.replace(/:/g, "");
      let emoji = emojiIndex.emojis[x];
      if (typeof emoji !== "undefined") {
        let unicode = emoji.native;
        if (typeof unicode !== "undefined") {
          return unicode;
        }
      }
      x = ":" + x + ":";
      return x;
    });
  };

  createMessage = () => {
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: this.state.user.uid,
        name: this.state.user.displayName,
        avatar: this.state.user.photoURL,
      },
      content: this.state.message,
    };
    return message;
  };

  sendMessage = () => {
    const { getMessagesRef } = this.props;
    const { message, channel } = this.state;

    if (message) {
      this.setState({ loading: true });
      getMessagesRef()
        .child(channel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({ loading: false, message: "", errors: [] });
        })
        .catch((err) => {
          console.error(err);
          this.setState({
            loading: false,
            errors: this.state.errors.concat(err),
          });
        });
    } else {
      this.setState({
        errors: this.state.errors.concat({ message: "Add a message" }),
      });
    }
  };

  render() {
    const { errors, message, loading, emojiPicker } = this.state;

    return (
      <Segment
        className="message__form"
        style={{ marginLeft: 320, marginRight: 300 }}
      >
        {emojiPicker && (
          <Picker
            set="apple"
            onSelect={this.handleAddEmoji}
            className="emoji-picker"
            title="Pick your emoji"
            emoji="point_up"
          />
        )}
        <Input
          fluid
          name="message"
          onChange={this.handleChange}
          value={message}
          ref={(node) => (this.messageInputRef = node)}
          style={{ marginBottom: "0.7em" }}
          label={
            <Button
              icon={emojiPicker ? "close" : "add"}
              content={emojiPicker ? "Close" : null}
              onClick={this.handleTogglePicker}
            />
          }
          labelPosition="left"
          className={
            errors.some((error) => error.message.includes("message"))
              ? "error"
              : ""
          }
          placeholder="Write your message"
        />
        <Button.Group icon widths="2">
          <Button
            onClick={this.sendMessage}
            disabled={loading}
            color="orange"
            content="Add Reply"
            labelPosition="left"
            icon="edit"
          />
        </Button.Group>
      </Segment>
    );
  }
}

export default MessageForm;

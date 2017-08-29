import React, { Component, PropTypes } from 'react';
import Select from 'react-select-plus';
import {
  FormGroup,
  ControlLabel,
  FormControl,
  Button,
  ButtonToolbar,
  Modal,
} from 'react-bootstrap';
import { icons } from '../../icons.constant';

const propTypes = {
  item: PropTypes.object,
  articles: PropTypes.array.isRequired, // eslint-disable-line
  save: PropTypes.func.isRequired,
};

class KbCategory extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      selectedArticles: this.getSelectedArticles(),
      selectedIcon: this.getSelectedIcon(),
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleIconChange = this.handleIconChange.bind(this);
  }

  getSelectedArticles() {
    const { item } = this.props;
    return (item && item.articleIds) || [];
  }

  getSelectedIcon() {
    const { item } = this.props;
    return (item && item.icon) || 'testIcon';
  }

  getArticles() {
    const results = [];

    const { articles } = this.props;

    results.push({
      label: 'Articles',
      options: articles.map(article => ({
        label: article.title,
        value: article._id,
      })),
    });
    return results;
  }

  getIcons() {
    return icons.map(opt => {
      return (
        <option key={opt} value={opt}>
          {opt}
        </option>
      );
    });
  }

  handleIconChange(event) {
    // TODO: refactor, move inside render method
    this.setState({
      selectedIcon: event.target.value,
    });
  }

  render() {
    const item = this.props.item || {};

    return (
      <form className="margined" onSubmit={this.handleSubmit}>
        <FormGroup controlId="knowledgebase-category-title">
          <ControlLabel>Title</ControlLabel>
          <FormControl type="text" defaultValue={item.title} required />
        </FormGroup>

        <FormGroup controlId="knowledgebase-category-description">
          <ControlLabel>Description</ControlLabel>
          <FormControl type="text" defaultValue={item.description} />
        </FormGroup>

        <FormGroup>
          <ControlLabel>Articles</ControlLabel>

          <Select
            placeholder="Choose articles"
            onChange={items => {
              this.setState({ selectedArticles: items });
            }}
            optionRenderer={option => (
              <div className="simple-option">
                <span>
                  {option.label}
                </span>
              </div>
            )}
            value={this.state.selectedArticles}
            options={this.getArticles()}
            multi
          />
        </FormGroup>

        <FormGroup controlId="knowledgebase-category-icon">
          <ControlLabel>Icon</ControlLabel>
          <FormControl
            componentClass="select"
            placeholder="select"
            onChange={this.handleIconChange}
            value={this.state.selectedIcon}
          >
            {this.getIcons()}
          </FormControl>
        </FormGroup>

        <Modal.Footer>
          <ButtonToolbar className="pull-right">
            <Button type="submit" bsStyle="primary">
              Save
            </Button>
          </ButtonToolbar>
        </Modal.Footer>
      </form>
    );
  }

  handleSubmit(e) {
    e.preventDefault();

    let articleIds = [];

    for (var i = 0; i < this.state.selectedArticles.length; i++) {
      articleIds.push(this.state.selectedArticles[i].value || this.state.selectedArticles[i]); // TODO: needs refactoring
    }

    this.context.closeModal();

    this.props.save({
      title: document.getElementById('knowledgebase-category-title').value,
      description: document.getElementById('knowledgebase-category-description').value,
      articleIds,
      icon: this.state.selectedIcon,
    });
  }
}

KbCategory.propTypes = propTypes;

KbCategory.contextTypes = {
  closeModal: PropTypes.func.isRequired,
};

export default KbCategory;

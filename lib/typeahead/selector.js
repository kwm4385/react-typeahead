var React = require('react');
var TypeaheadOption = require('./option');
var classNames = require('classnames');

/**
 * Container for the options rendered as part of the autocompletion process
 * of the typeahead
 */
var TypeaheadSelector = React.createClass({
  displayName: 'TypeaheadSelector',

  propTypes: {
    options: React.PropTypes.array,
    allowCustomValues: React.PropTypes.number,
    customClasses: React.PropTypes.object,
    customValue: React.PropTypes.string,
    selectionIndex: React.PropTypes.number,
    onOptionSelected: React.PropTypes.func,
    displayOption: React.PropTypes.func.isRequired,
    defaultClassNames: React.PropTypes.bool,
    areResultsTruncated: React.PropTypes.bool,
    resultsTruncatedMessage: React.PropTypes.string
  },

  getDefaultProps: function () {
    return {
      selectionIndex: null,
      customClasses: {},
      allowCustomValues: 0,
      customValue: null,
      onOptionSelected: function (option) {},
      defaultClassNames: true
    };
  },

  render: function () {
    // Don't render if there are no options to display
    if (!this.props.options.length && this.props.allowCustomValues <= 0) {
      return false;
    }

    var classes = {
      "typeahead-selector": this.props.defaultClassNames
    };
    classes[this.props.customClasses.results] = this.props.customClasses.results;
    var classList = classNames(classes);

    // CustomValue should be added to top of results list with different class name
    var customValue = null;
    var customValueOffset = 0;
    if (this.props.customValue !== null) {
      customValueOffset++;
      customValue = React.createElement(
        TypeaheadOption,
        { ref: this.props.customValue, key: this.props.customValue,
          hover: this.props.selectionIndex === 0,
          customClasses: this.props.customClasses,
          customValue: this.props.customValue,
          onMouseDown: this._onMouseDown.bind(this, this.props.customValue) },
        this.props.customValue
      );
    }

    var results = this.props.options.map(function (result, i) {
      var displayNode = this.props.displayOption(result, i);
      var uniqueKey = (typeof displayNode === 'string' ? displayNode : displayNode.key) + '_' + i;
      return React.createElement(
        TypeaheadOption,
        { ref: uniqueKey, key: uniqueKey,
          hover: this.props.selectionIndex === i + customValueOffset,
          customClasses: this.props.customClasses,
          onMouseDown: this._onMouseDown.bind(this, result) },
        displayNode
      );
    }, this);

    if (this.props.areResultsTruncated && this.props.resultsTruncatedMessage !== null) {
      var resultsTruncatedClasses = {
        "results-truncated": this.props.defaultClassNames
      };
      resultsTruncatedClasses[this.props.customClasses.resultsTruncated] = this.props.customClasses.resultsTruncated;
      var resultsTruncatedClassList = classNames(resultsTruncatedClasses);

      results.push(React.createElement(
        'li',
        { key: 'results-truncated', className: resultsTruncatedClassList },
        this.props.resultsTruncatedMessage
      ));
    }

    return React.createElement(
      'ul',
      { className: classList },
      customValue,
      results
    );
  },

  _onMouseDown: function (result, event) {
    return this.props.onOptionSelected(result, event);
  }

});

module.exports = TypeaheadSelector;
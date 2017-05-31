import $ from "jquery";
import "Kendo/kendo.grid.js";
import getTableWrapperTemplate from "./templates/tablewrappertemplate.js";

class Table {
    /**
     * Constructor takes props argument object and calls setupGrid method to setup a new kendoGrid based on those props
     * @param  {object} props config object.  (Props terminology borrowed from React.)
     * @param {function} props.getModel a function that when run will return the model for the grid
     * @param {function} props.getNewDataSource a function that when run will return the kendo data source for the grid, based on the model data passed to it
     */
    constructor(props) {
        this._props = props;
        this._wrapperSelector = props.wrapperSelector || "#tableWrapper";
        this._el = props.getModel().name;
        this.setupGrid();
    }

    /**
     * method setups up the kendo grid based on props passed to the constructor
     *  @return {null} nothing returned.  Grid is setup on the element this.el, which is based on the model definition name
     */
    setupGrid() {
        const that = this;
        const dataSource = this._props.getNewDataSource({
            model: this._props.getModel().model,
            paths: this._props.getModel().paths
        }); // eslint-disable-line dot-notation

        const templateData = getTableWrapperTemplate(
            this._props.getModel().name,
            this._props.getModel().title || "Unknown title"
        ); // eslint-disable-line dot-notation
        const parsedHTML = $.parseHTML(templateData);

        const $wrapper = $(this._wrapperSelector);
        $wrapper.append(parsedHTML);
        const $el = $wrapper.find(`#${this._el}`);

        $el.kendoGrid({
            dataSource,
            height: 550,
            groupable: true,
            sortable: true,
            pageable: {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            },
            columns: that._props.getModel().columns
        });
    }
}

export default Table;

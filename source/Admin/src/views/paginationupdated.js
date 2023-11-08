import React, { Component, Fragment } from "react";
import ChevronLeftRoundedIcon from '@material-ui/icons/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@material-ui/icons/ChevronRightRounded';
import {
  Pagination, PaginationItem, PaginationLink,
  UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem
} from "reactstrap";
const numberofpages = 10;



const defaultButton = props => (
  <button type="button" {...props} className="-btn">
    {props.children}
  </button>
);

export default class DataTablePaginationUpdated extends Component {
  constructor(props) {
    super(props);

    this.getSafePage = this.getSafePage.bind(this);
    this.changePage = this.changePage.bind(this);
    this.applyPage = this.applyPage.bind(this);
    this.pageClick = this.pageClick.bind(this);
    this.renderPages = this.renderPages.bind(this);
    this.changePageSize = this.changePageSize.bind(this);
    this.renderPageJump = this.renderPageJump.bind(this);

    // console.log(props);
    this.state = {
      page: props.page,
      pageSize: this.props.defaultPageSize
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ page: nextProps.page });
  }

  getSafePage(page) {
    if (Number.isNaN(page)) {
      page = this.props.page;
    }
    return Math.min(Math.max(page, 0), this.props.pages - 1);
  }

  changePageSize(size) {
    this.props.onPageSizeChange(size);
    this.setState({ pageSize: size });

  }

  changePage(page) {
    page = this.getSafePage(page);
    this.setState({ page });
    if (this.props.page !== page) {
      this.props.onPageChange(page);
    }
  }

  applyPage(e) {
    if (e) {
      e.preventDefault();
    }
    const page = this.state.page;
    this.changePage(page === "" ? this.props.page : page);
  }

  pageClick(pageIndex) {
    this.changePage(pageIndex);
  }

  renderPages() {
    let pageCount = this.props.pages;
    let pageButtons = [];
    console.log('page:', this.state.page);
    if (this.state.page != 0 && this.state.page + numberofpages >= pageCount - numberofpages) {
      pageButtons.push(
        <PaginationItem key={"start"} disabled>
          <PaginationLink
          >{'...'}</PaginationLink>
        </PaginationItem>
      );
    }
    let startfrom = (this.state.page + numberofpages > pageCount) ? ((pageCount > numberofpages) ? (pageCount - numberofpages) : 0) : this.state.page;
    for (let i = startfrom; i < this.state.page + numberofpages && i < pageCount; i++) {
      let active = this.state.page === i ? true : false;
      pageButtons.push(
        <PaginationItem key={i} active={active}>
          <PaginationLink
            onClick={() => this.pageClick(i)}
          >{i + 1}</PaginationLink>
        </PaginationItem>
      );
    }
    if (this.state.page + numberofpages < pageCount) {
      pageButtons.push(
        <PaginationItem key={"end"} disabled>
          <PaginationLink
          >{'...'}</PaginationLink>
        </PaginationItem>
      );
    }
    return pageButtons;
  }

  renderPageJump() {
    let pages = this.props.pages;
    let pageNumbers = [];
    for (let i = 0; i < pages; i++) {
      pageNumbers.push(
        <DropdownItem
          key={i}
          onClick={() => this.changePage(i)}
        >
          {i + 1}
        </DropdownItem>
      );
    }
    return pageNumbers;
  }

  render() {
    const {
      page,
      pages,
      canPrevious,
      canNext,
      pageSizeOptions,
      showPageSizeOptions,
      showPageJump
    } = this.props;

    return (
      <Fragment>
        <div className="text-center custom-pagination">
          {/* {
            showPageJump &&
            <div className="float-left pt-2"><span>Page </span>
              <UncontrolledDropdown className="d-inline-block">
                <DropdownToggle caret color="outline-primary" size="xs">
                  {this.state.page + 1}
                </DropdownToggle>
                <DropdownMenu direction="left" >
                  {this.renderPageJump()}
                </DropdownMenu>
              </UncontrolledDropdown>
              <span> of </span>{pages}</div>
          } */}

          <Pagination className="d-inline-block text-center" size="sm" listClassName="justify-content-center" aria-label="Page navigation example">
            <PaginationItem className={`${!canPrevious && "disabled"}`}>
              <PaginationLink
                className={"prev"}
                onClick={() => {
                  if (!canPrevious) return;
                  this.changePage(page - 1);
                }}
                disabled={!canPrevious}
              >
                <ChevronLeftRoundedIcon />
              </PaginationLink>
            </PaginationItem>

            {this.renderPages()}
            <PaginationItem className={`${!canNext && "disabled"}`}>
              <PaginationLink
                className="next"
                onClick={() => {
                  if (!canNext) return;
                  this.changePage(page + 1);
                }}
                disabled={!canNext}
              >
                <ChevronRightRoundedIcon />
              </PaginationLink>
            </PaginationItem>
          </Pagination>
          {/* {
            showPageSizeOptions &&
            <div className="float-right pt-2">
              <span className="text-muted text-small mr-1">Items </span>
              <UncontrolledDropdown className="d-inline-block">
                <DropdownToggle caret color="outline-primary" size="xs">
                  {this.state.pageSize}
                </DropdownToggle>
                <DropdownMenu right>
                  {pageSizeOptions.map((size, index) => {
                    return (
                      <DropdownItem
                        key={index}
                        onClick={() => this.changePageSize(size)}
                      >
                        {size}
                      </DropdownItem>
                    );
                  })}
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          } */}
        </div>
      </Fragment>
    );
  }
}

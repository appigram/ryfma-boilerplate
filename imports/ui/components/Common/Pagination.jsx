import React from 'react'
import ReactPaginate from 'react-paginate'
import { Icon } from 'semantic-ui-react'

class Pagination extends React.Component {
  handlePageChange = (data) => {
    const nextPage = parseInt(data.selected, 10) + 1
    this.props.changePage(nextPage)
  }

  render () {
    const { pageCount, pageNum } = this.props
    return (
      <div className='pagination'>
        <ReactPaginate
          previousLabel={<Icon name='angle left' />}
          nextLabel={<Icon name='angle right' />}
          breakLabel={<span>...</span>}
          breakClassName={'break'}
          forcePage={pageNum - 1}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={this.handlePageChange}
          containerClassName={'pagination-list'}
          subContainerClassName={'pages pagination'}
          activeClassName={'active'}
        />
      </div>
    )
  }
}

export default Pagination

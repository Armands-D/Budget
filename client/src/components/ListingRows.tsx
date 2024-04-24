// React
import exp from 'constants';
import React, { createElement } from 'react';
// Data types

function tableSection(name: string, items: {}){
  const heading = <thead></thead>
}

function ListingRows({props}: {props: any}){
  return <tr>{Object.values(props).join('/')}</tr>
}

export {ListingRows}
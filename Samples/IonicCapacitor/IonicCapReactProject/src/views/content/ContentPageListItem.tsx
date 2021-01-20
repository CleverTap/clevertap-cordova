import { 
  IonRippleEffect, 
  IonText 
} from '@ionic/react';
import React from 'react';
import { CleverTapAction } from '../../controllers/CleverTapAPIController';
import { ListItem } from '../../models/Page';
import './../../themes/contentpagelistitem.css'
interface ContainerProps {
  item: ListItem;
}

const ListUIItem: React.FC<ContainerProps> = ({ item }) => {
  return (
<div >
  <IonText onClick={() =>CleverTapAction(item)}>
      <p>{item.title}</p>
  </IonText>

<IonRippleEffect></IonRippleEffect>
</div>
  );
};

export default ListUIItem;
import {
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from '@ionic/react';

import React from 'react';
import { useLocation } from 'react-router-dom';
import './../../themes/leftnav.css';
import Pages from '../../data/Pages';

const Menu: React.FC = () => {
  const location = useLocation();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent >
        <IonList id="inbox-list">
          <IonListHeader>CleverTap</IonListHeader>
          <IonNote>IonicStarter</IonNote>
          {Pages.map((page, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === `/page/${page.id}` ? 'selected' : ''} routerLink={`/page/${page.id}`} routerDirection="none" lines="none" detail={false}>
                  <IonLabel>{page.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;

import { 
  IonButtons, 
  IonContent, 
  IonHeader, 
  IonItem, 
  IonList, 
  IonMenuButton, 
  IonPage, 
  IonTitle, 
  IonToolbar 
} from '@ionic/react';
import React from 'react';
import { useParams } from 'react-router-dom';
import ListUIItem from './ContentPageListItem';
import { AppPage, ListItem } from '../../models/Page';
import AppPages from '../../data/Pages'

const Page: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const page = AppPages.find(item => item.id === name) as AppPage;

  return (
    <IonPage >
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{page.title}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{page.title}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList >
        {page.items.map((pageitem:ListItem) => {
            return (
              <IonItem key={pageitem.title} >
                <ListUIItem item={pageitem} ></ListUIItem >
              </IonItem>
            );
          })}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Page;
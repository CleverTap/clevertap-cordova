import { IonButtons, IonContent, IonHeader, IonItem, IonList, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import ListUIItem from './PageListItem';
import { AppPage,ListItem } from '../../models/Page';
import './Page.css';
import AppPages from '../../clevertap/data/Pages'
interface PageProps {
  match: {params:{
    name: string;
  }};
}
const Page: React.FC<PageProps> = (props:PageProps) => {

  const page = AppPages.find(item => item.id === props.match.params.name) as AppPage;

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
              <IonItem >
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

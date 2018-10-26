import { Drivers } from '../../../both/collections/drivers.collection';
import { Driver } from '../../../both/models/driver.model';

/**
 * function that load basic testing drivers
 * Created by dominiksecka on 2/16/17.
 */
export function loadDrivers(){
    // if(Drivers.find().cursor.count() === 0) {
    //     const drivers: Driver[] = [{
    //         _id: 'id',
    //         name: 'Dominik',
    //         avg_speed: 43,
    //         max_speed: 65,
    //         rating: 5,
    //         no_rides: 2,
    //         total_distance: 234,
    //         total_duration: 41234,
    //         picture: 'https://randomuser.me/api/portraits/thumb/lego/1.jpg',
    //         bus: false,
    //         tram: true,
    //         email: "secka.dominik@gmail.com",
    //         birthday: new Date('2017-03-09 00:00:00.000Z'),
    //         sex: "M"
    //     },{
    //         _id: 'id2',
    //         name: 'Lukas',
    //         avg_speed: 23,
    //         max_speed: 65,
    //         rating: 5,
    //         no_rides: 4,
    //         total_distance: 2334,
    //         total_duration: 434,
    //         picture: 'https://randomuser.me/api/portraits/thumb/lego/1.jpg',
    //         bus: true,
    //         tram: true,
    //         email: "lukas.prokein@gmail.com",
    //         birthday: new Date('2017-03-09 00:00:00.000Z'),
    //         sex: "M"
    //     },{
    //         _id: 'id3',
    //         name: 'Pavol',
    //         avg_speed: 243,
    //         max_speed: 62,
    //         rating: 5,
    //         no_rides: 3,
    //         total_distance: 334,
    //         total_duration: 34,
    //         picture: 'https://randomuser.me/api/portraits/thumb/men/1.jpg',
    //         bus: true,
    //         tram: false,
    //         email: "pavol.zmuda@gmail.com",
    //         birthday: new Date('2017-03-09 00:00:00.000Z'),
    //         sex: "M"
    //     }];
    //
    //     drivers.forEach((driver: Driver) => Drivers.insert(driver));
    // }
}
import { useParams, Link } from "react-router-dom";
import { TripProps, PermitProps } from "./TripControl";
import { useState, useEffect } from "react";
import { registerTrip, getRegistration } from "../api-helper";
import TripComments from "./TripComments";

interface TripDetailProps {
  trips: TripProps[];
};


const TripDetails: React.FC<TripDetailProps> = ({ trips }) => {
  const { id } = useParams<{ id: string }>();
  const trip = trips.find(trip => trip.id === Number(id));

  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const checkTripRegistration = async () => {
      if (!trip) {
        return;
      }
      try {
        const registrationStatus = await getRegistration(Number(id));
        console.log('tripid', id);
        setIsRegistered(registrationStatus);
      } catch (error) {
        console.error('An error occurred:', error)
      }
    };
    checkTripRegistration();
  }, [id]);

  if (!trip) {
    return <div>Loading...</div>
  }

  const openModal = () => {
    setIsModalOpen(true);
  }
  const closeModal = () => {
    setIsModalOpen(false);
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCheckboxChecked(e.target.checked);
  }

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCheckboxChecked) {
      setErrorMessage('You must agree to the terms and conditions before registering.');
      return;
    }
    setIsLoading(true);
    try {
      await registerTrip(Number(id));
      setIsRegistered(true);
      localStorage.setItem(`tripRegistered-${id}`, 'true');
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const formattedDate = new Date(trip.date);
  const formatCloseDate = new Date(trip.registration_close_date)
  const dateString = `${formattedDate.toLocaleString('default', { month: 'long' })} ${formattedDate.getDate()}, ${formattedDate.getFullYear()}`;
  const closeDate = `${formatCloseDate.toLocaleString('default', { month: 'long' })} ${formatCloseDate.getDate()}, ${formatCloseDate.getFullYear()}`;

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const tripTime = new Date();
    tripTime.setHours(Number(hours));
    tripTime.setMinutes(Number(minutes));
    return tripTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  };

  const startTime = formatTime(trip.time_start);
  const endTime = formatTime(trip.time_end);

  return (
    <>
      <img src={trip.image_url} alt="forest photo" style={{ width: '150px', height: '150px' }} />
      <h3>Status: {trip.status}</h3>

      <p>Date: {dateString}</p>
      <p>Leader: {trip.leaderName}</p>
      <p>Time: {startTime} to {endTime}</p>
      <p>Area: {trip.general_location}</p>
      <p>(to become a map) Location: {trip.specific_location}</p>
      <p>Capacity: {trip.capacity}</p>
      <p>Restrictions: {trip.restrictions}</p>
      <p>Additional information: {trip.note}</p>
      <h3>Registration closes: {closeDate}</h3>
      <h4>Permits required:</h4>
      <ul>
        {trip.permits.map((permit: PermitProps) => (
          <div key={permit.id}>
            <li>{permit.name}: Annual: {permit.annual_cost}, Daily: {permit.day_cost}</li>
          </div>
        ))}
      </ul>
      <p>See the <Link to="/resources">resources page</Link> for more info about permits and preparation</p>
      <hr />
      <div id="genericInfo">
        <p>Field trips are for educational purposes. They take place rain or shine.  There is no guarantee of what will be found in the area.</p>
        <p></p>
        <ul>
          <li>Participation is limited to current OMS members and any household members with whom you share a membership.</li>
          <li>No guests allowed.</li>
          <li>Please register only if you are confident you can go if selected.
            No-shows and late cancellations will be banned from field trips through the following season. (For example, if you cancel last minute on a Spring trip, you will be banned through the following Fall season.) We've already had several people no-show or cancel late this season.</li>
          <li>Participants will be selected by a weighted random number lottery, with priority given to volunteers.</li>
          <li>You will be notified by email within 2 days of the registration closing date. If you do not see an email, check your spam folder.</li>
        </ul>
        <p>Covid-19 restrictions for this trip
          Carpooling: At your own risk
          If you have any covid symptoms, you may not attend the field trip. If you develop any covid-related symptoms within 10 days of said field trip, you must notify the trip leader.</p>

        <p>Can't make it on this trip?
          Organize your own foray with members outside of a regular field trip. Go to Members Only/Forums/Self Led Trips.</p>
        <p>We have a forum organized by interest group to socialize and connect here:
          https://www.wildmushrooms.org/resources/forums/</p>
        <p>If you have general questions about this process or our field trips, contact us at fieldtrips@wildmushrooms.org.
          For general questions about OMS, email us at info@wildmushrooms.org.</p>
      </div>
      <hr />
      {errorMessage && <p style={{ color: 'red', fontWeight: 'bold' }}>{errorMessage}</p>}
      {!isRegistered ? (
        <form onSubmit={handleRegistration}>
          <legend>Apply</legend>
          <input id="agree" type="checkbox" checked={isCheckboxChecked} onChange={handleCheckboxChange} />
          <label htmlFor="agree">I agree to the terms and conditions.</label>
          <button type="button" onClick={openModal}>Read terms and conditions</button>
          {isModalOpen && (
            <div className="modal">
              <button type="button" onClick={closeModal}>Close terms</button>
              <p>I understand if I am selected and fail to attend this field trip, I may not attend future trips through next season. </p>
              <p>I accept responsibility for my safety and conduct, and of others I bring on this field trip.</p>
              <h5>Oregon Mycological Society / Liability Release and Promise Not to Sue</h5>
              <p>I understand there is some risk in participating in a mushroom mycology camp, field trip or other activity - all those risks one assumes by being away from home, risks associated with moving about in fields and woods, risks involved in eating wild mushrooms, risks of losing personal property by theft or misplacement, and all other expected and unexpected risks.
                In joining OMS or registering for or attending any OMS mycology camp, field trip or other activity, I agree to assume total responsibility during an event for my own
                safety and well-being and that of any minor children under my care, and for the protection of my and their personal property.
                I release The Oregon Mycological Society (OMS), its directors, officers, volunteers, contractors, and all other persons assisting in the planning and presentation of an OMS mycology camp, field trip or other activity from liability for any sickness, injury, or loss, I, or any minor children under my care, may suffer during an OMS mycology camp, field trip or other activity or as a result of attending or participating. I further promise not to file a lawsuit or make a claim against any of the persons listed above, even if they negligently cause me or any minor children under my care injury or loss.
                Finally, I agree to hold The Oregon Mycological Society harmless from any liability it may incur as a result of any damage to any property I may cause. This
                release and promise is part of the consideration I give in order to participate in an OMS mycology camp, field trip or other activity. I understand it affects my legal rights. I intend it to apply not only to me but to anyone who may have the right to make a claim on my behalf.</p>
            </div>
          )}
          <button type="submit" disabled={isLoading}>{isLoading ? 'Registration in progress...' : 'Register'}</button>
        </form>
      ) : (
        <h3 style={{ color: 'green', fontWeight: 'bold' }}>You have registered for this trip</h3>
      )}
      <hr />
      <p>weather api call based on specific_location</p>
      <p>leaflet map? specific_location</p>
      <hr />
      <TripComments />
      <hr />
      <p>mushroom component</p>
    </>
  )
}
export default TripDetails;
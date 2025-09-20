import React, { useState, useEffect } from 'react';
import { apiClient } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';

interface ProfileData {
  first_name?: string;
  surname?: string;
  date_of_birth?: string;
  building_house?: string;
  street_address?: string;
  city_town?: string;
  county_state?: string;
  postal_zip?: string;
  country?: string;
  telephone?: string;
  nationality?: string;
}

const Profile: React.FC = () => {
  const { } = useAuth();
  const [profile, setProfile] = useState<ProfileData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await apiClient.getProfile();
        setProfile(profileData);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await apiClient.updateProfile(profile);
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof ProfileData, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return <div className="text-center">Loading profile...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Manage your personal information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {message && (
              <Alert variant={message.includes('success') ? 'default' : 'destructive'}>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name</label>
                <Input
                  value={profile.first_name || ''}
                  onChange={(e) => handleChange('first_name', e.target.value)}
                  placeholder="First name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Surname</label>
                <Input
                  value={profile.surname || ''}
                  onChange={(e) => handleChange('surname', e.target.value)}
                  placeholder="Surname"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date of Birth</label>
              <Input
                type="date"
                value={profile.date_of_birth || ''}
                onChange={(e) => handleChange('date_of_birth', e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Building/House</label>
                  <Input
                    value={profile.building_house || ''}
                    onChange={(e) => handleChange('building_house', e.target.value)}
                    placeholder="Building/House number"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Street Address</label>
                  <Input
                    value={profile.street_address || ''}
                    onChange={(e) => handleChange('street_address', e.target.value)}
                    placeholder="Street address"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">City/Town</label>
                  <Input
                    value={profile.city_town || ''}
                    onChange={(e) => handleChange('city_town', e.target.value)}
                    placeholder="City/Town"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">County/State</label>
                  <Input
                    value={profile.county_state || ''}
                    onChange={(e) => handleChange('county_state', e.target.value)}
                    placeholder="County/State"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Postal/ZIP Code</label>
                  <Input
                    value={profile.postal_zip || ''}
                    onChange={(e) => handleChange('postal_zip', e.target.value)}
                    placeholder="Postal/ZIP code"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Country</label>
                  <Input
                    value={profile.country || ''}
                    onChange={(e) => handleChange('country', e.target.value)}
                    placeholder="Country"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Telephone</label>
                <Input
                  value={profile.telephone || ''}
                  onChange={(e) => handleChange('telephone', e.target.value)}
                  placeholder="Phone number"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nationality</label>
                <Input
                  value={profile.nationality || ''}
                  onChange={(e) => handleChange('nationality', e.target.value)}
                  placeholder="Nationality"
                />
              </div>
            </div>

            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;

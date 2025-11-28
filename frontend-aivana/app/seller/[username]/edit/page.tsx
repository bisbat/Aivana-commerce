'use client';
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSellerProfileAction, updateSellerProfileAction } from "@/lib/actions/user.actions";
import { sellerProfile } from "@/lib/types/user.ts/seller";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Loader, Save, ArrowLeft, Plus, X } from "lucide-react";

export default function EditSellerProfilePage() {
    const params = useParams();
    const router = useRouter();
    const username = Array.isArray(params.username)
        ? params.username[0]
        : params.username;

    const [seller, setSeller] = useState<sellerProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    // Form data
    const [bio, setBio] = useState("");
    const [location, setLocation] = useState("");
    const [skills, setSkills] = useState<string[]>([]);
    const [tools, setTools] = useState<string[]>([]);
    const [bankName, setBankName] = useState("");
    const [bankAccountNumber, setBankAccountNumber] = useState("");
    const [bankAccountName, setBankAccountName] = useState("");
    const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});
    
    // Temporary inputs for arrays
    const [newSkill, setNewSkill] = useState("");
    const [newTool, setNewTool] = useState("");
    const [newSocialPlatform, setNewSocialPlatform] = useState("");
    const [newSocialUrl, setNewSocialUrl] = useState("");

    useEffect(() => {
        async function fetchFormData(){
            try {
                const profileData = await getSellerProfileAction(username!);
                setSeller(profileData);
                
                // Populate form fields
                setBio(profileData.bio || "");
                setLocation(profileData.location || "");
                setSkills(profileData.skills || []);
                setTools(profileData.tools || []);
                setBankName(profileData.bankName || "");
                setBankAccountNumber(profileData.bankAccountNumber || "");
                setBankAccountName(profileData.bankAccountName || "");
                setSocialLinks(profileData.socialLinks || {});
            } catch (error) {
                console.error("Error fetching seller data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchFormData();
    }, [username]);

    const handleAddSkill = () => {
        if (newSkill.trim() && !skills.includes(newSkill.trim())) {
            setSkills([...skills, newSkill.trim()]);
            setNewSkill("");
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setSkills(skills.filter(skill => skill !== skillToRemove));
    };

    const handleAddTool = () => {
        if (newTool.trim() && !tools.includes(newTool.trim())) {
            setTools([...tools, newTool.trim()]);
            setNewTool("");
        }
    };

    const handleRemoveTool = (toolToRemove: string) => {
        setTools(tools.filter(tool => tool !== toolToRemove));
    };

    const handleAddSocialLink = () => {
        if (newSocialPlatform.trim() && newSocialUrl.trim()) {
            setSocialLinks({
                ...socialLinks,
                [newSocialPlatform.trim()]: newSocialUrl.trim()
            });
            setNewSocialPlatform("");
            setNewSocialUrl("");
        }
    };

    const handleRemoveSocialLink = (platform: string) => {
        const newLinks = { ...socialLinks };
        delete newLinks[platform];
        setSocialLinks(newLinks);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!seller) return;

        setIsSaving(true);
        try {
            await updateSellerProfileAction(seller.id, {
                bio,
                location,
                skills,
                tools,
                socialLinks,
                bankName,
                bankAccountNumber,
                bankAccountName
            });
            
            // Redirect back to seller profile
            router.push(`/seller/${username}`);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="flex items-center space-x-3 text-purple-400">
                    <Loader className="animate-spin" size={32} />
                    <span className="text-lg">Loading profile...</span>
                </div>
            </div>
        );
    }

    if (!seller) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-400 mb-4">Profile Not Found</h1>
                    <Button onClick={() => router.back()}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900">
            <div className="max-w-4xl mx-auto py-8 px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                        <Button 
                            variant="ghost" 
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
                            <p className="text-slate-400">@{seller.user.username}</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <div className="bg-slate-800/50 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-white mb-2">
                                    Bio
                                </label>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Tell us about yourself..."
                                    rows={4}
                                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
                                />
                            </div>
                            <Input
                                label="Location"
                                value={location}
                                onChange={setLocation}
                                placeholder="e.g., Bangkok, Thailand"
                            />
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="bg-slate-800/50 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-6">Skills</h2>
                        
                        {/* Add new skill */}
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                placeholder="Add a skill..."
                                className="flex-1 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                            />
                            <Button type="button" onClick={handleAddSkill}>
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Skills list */}
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill, index) => (
                                <div key={index} className="flex items-center gap-1 bg-purple-600/20 border border-purple-500/30 rounded-full px-3 py-1">
                                    <span className="text-purple-300 text-sm">{skill}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSkill(skill)}
                                        className="text-purple-400 hover:text-purple-200"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tools */}
                    <div className="bg-slate-800/50 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-6">Tools & Technologies</h2>
                        
                        {/* Add new tool */}
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={newTool}
                                onChange={(e) => setNewTool(e.target.value)}
                                placeholder="Add a tool..."
                                className="flex-1 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTool())}
                            />
                            <Button type="button" onClick={handleAddTool}>
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Tools list */}
                        <div className="flex flex-wrap gap-2">
                            {tools.map((tool, index) => (
                                <div key={index} className="flex items-center gap-1 bg-blue-600/20 border border-blue-500/30 rounded-full px-3 py-1">
                                    <span className="text-blue-300 text-sm">{tool}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTool(tool)}
                                        className="text-blue-400 hover:text-blue-200"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="bg-slate-800/50 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-6">Social Links</h2>
                        
                        {/* Add new social link */}
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={newSocialPlatform}
                                onChange={(e) => setNewSocialPlatform(e.target.value)}
                                placeholder="Platform name (e.g., GitHub)"
                                className="flex-1 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                            />
                            <input
                                type="url"
                                value={newSocialUrl}
                                onChange={(e) => setNewSocialUrl(e.target.value)}
                                placeholder="URL"
                                className="flex-1 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                            />
                            <Button type="button" onClick={handleAddSocialLink}>
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Social links list */}
                        <div className="space-y-2">
                            {Object.entries(socialLinks).map(([platform, url]) => (
                                <div key={platform} className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3">
                                    <div>
                                        <span className="font-medium text-white">{platform}</span>
                                        <p className="text-sm text-slate-400">{url}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSocialLink(platform)}
                                        className="text-red-400 hover:text-red-200 p-1"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Banking Information */}
                    <div className="bg-slate-800/50 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-6">Banking Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Bank Name"
                                value={bankName}
                                onChange={setBankName}
                                placeholder="e.g., Kasikorn Bank"
                                required
                            />
                            <Input
                                label="Account Number"
                                value={bankAccountNumber}
                                onChange={setBankAccountNumber}
                                placeholder="e.g., 1234567890"
                                required
                            />
                            <div className="md:col-span-2">
                                <Input
                                    label="Account Holder Name"
                                    value={bankAccountName}
                                    onChange={setBankAccountName}
                                    placeholder="Full name as registered with bank"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={() => router.back()}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <>
                                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
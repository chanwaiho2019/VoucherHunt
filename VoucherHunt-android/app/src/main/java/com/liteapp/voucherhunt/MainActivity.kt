package com.liteapp.voucherhunt

import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentTransaction
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.liteapp.voucherhunt.core.CoreManager
import com.liteapp.voucherhunt.fragments.MainFragment
import com.liteapp.voucherhunt.fragments.ProfileFragment
import com.liteapp.voucherhunt.fragments.SaveFragment
import com.liteapp.voucherhunt.fragments.SettingFragment


class MainActivity : AppCompatActivity() {

    val mCtx = this

    lateinit var mainFragment:MainFragment
    lateinit var saveFragment: SaveFragment
    lateinit var profileFragment: ProfileFragment
    lateinit var settingFragment: SettingFragment

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        //Initalize SpendLiteManager
        CoreManager.getInstance(this)

        mainFragment = MainFragment()
        saveFragment = SaveFragment()
        profileFragment = ProfileFragment()
        settingFragment = SettingFragment()

        loadFragment(mainFragment)

        val bn = findViewById<BottomNavigationView>(R.id.bottom_navigation)
        bn.setOnNavigationItemSelectedListener { item ->
            when(item.itemId) {
                R.id.hot -> {
                    loadFragment(mainFragment)
                    true
                }
                R.id.saved -> {
                    loadFragment(saveFragment)
                    true
                }
                R.id.profile -> {
                    loadFragment(profileFragment)
                    true
                }
                R.id.setting -> {
                    loadFragment(settingFragment)
                    true
                }
                else -> false
            }
        }

    }

    override fun onCreateOptionsMenu(menu: Menu?): Boolean {
        return false
    }


    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        return when (item.itemId) {
            R.id.action_settings -> true
            else -> super.onOptionsItemSelected(item)
        }
    }

    private fun loadFragment(fragment: Fragment) {
        // load fragment
        val transaction: FragmentTransaction = supportFragmentManager.beginTransaction()
        transaction.setCustomAnimations(R.animator.fade_in, R.animator.fade_out)
        transaction.replace(R.id.frame_container, fragment)

        transaction.addToBackStack(null)
        transaction.commit()
    }

    override fun onResume() {
        super.onResume()
    }
}